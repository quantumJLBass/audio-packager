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
        return_timestamps: true,
        chunk_length_s: 30,
        stride_length_s: 5,
        device: "webgpu"
      } as any // Type assertion needed due to missing types in the library
    );

    const result = await transcriber(float32Array, {
      return_timestamps: true,
    });

    const chunks = Array.isArray(result.chunks) ? result.chunks : [result];
    
    return chunks.map((chunk: any, index: number) => {
      const timestamps = chunk.timestamp || [0, 0];
      return {
        text: chunk.text || "(no speech detected)",
        start: timestamps[0],
        end: timestamps[1],
        confidence: chunk.confidence || 0.95,
        speaker: { id: `speaker-${index + 1}`, name: `Speaker ${index + 1}`, color: getRandomColor() }
      };
    });
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
  
  const result = await classifier(text);
  const output = Array.isArray(result) ? result[0] : result;
  return output.label as string;
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
  return 440; // Placeholder
};

const calculateTempo = (audioData: Float32Array): number => {
  // Implement tempo detection algorithm
  return 120; // Placeholder
};

const calculateEnergy = (audioData: Float32Array): number => {
  // Calculate RMS energy
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