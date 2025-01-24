import { pipeline } from "@huggingface/transformers";
import { AudioAnalysis, Transcription, Speaker } from "@/types/audio";

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.getChannelData(0);
};

export const transcribeAudio = async (float32Array: Float32Array): Promise<Transcription[]> => {
  try {
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "openai/whisper-large-v3",
      {
        return_timestamps: "word",
        chunk_length_s: 30,
        stride_length_s: 5,
        device: "webgpu"
      } as any
    );

    const result = await transcriber(float32Array, {
      return_timestamps: "word",
    }) as any;

    if (!result || (!Array.isArray(result) && !result.text)) {
      throw new Error("Invalid transcription result");
    }

    const segments = Array.isArray(result) ? result : [result];
    
    return segments.map((segment: any, index: number) => ({
      text: segment.text || "(no speech detected)",
      start: segment.timestamp?.[0] || 0,
      end: segment.timestamp?.[1] || 5,
      confidence: segment.confidence || 0.95,
      speaker: { 
        id: `speaker-${index + 1}`, 
        name: `Speaker ${index + 1}`, 
        color: getRandomColor() 
      }
    }));
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

export const analyzeSentiment = async (text: string): Promise<string> => {
  const classifier = await pipeline(
    "text-classification",
    "SamLowe/roberta-base-go_emotions",
    { device: "webgpu" }
  );
  
  const result = await classifier(text) as any;
  return result[0]?.label || 'neutral';
};

export const analyzeTone = async (audioData: Float32Array): Promise<AudioAnalysis['tone']> => {
  return {
    pitch: calculatePitch(audioData),
    tempo: calculateTempo(audioData),
    energy: calculateEnergy(audioData)
  };
};

const calculatePitch = (audioData: Float32Array): number => {
  // Implement pitch detection algorithm
  return 440;
};

const calculateTempo = (audioData: Float32Array): number => {
  // Implement tempo detection algorithm
  return 120;
};

const calculateEnergy = (audioData: Float32Array): number => {
  const sum = audioData.reduce((acc, val) => acc + val * val, 0);
  return Math.sqrt(sum / audioData.length);
};

const getRandomColor = (): string => {
  const colors = [
    '#4f46e5', '#7c3aed', '#db2777', '#ea580c', 
    '#16a34a', '#2563eb', '#9333ea', '#c026d3'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};