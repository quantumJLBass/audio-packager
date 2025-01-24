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
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: true,
        device: "webgpu"
      }
    );

    const result = await transcriber(float32Array);
    const chunks = Array.isArray(result) ? result : [result];
    
    return chunks.map((chunk, index) => {
      const timestamps = chunk.chunks?.[0]?.timestamp || [0, 0];
      return {
        text: chunk.text || "(no speech detected)",
        start: timestamps[0],
        end: timestamps[1],
        confidence: 0.95,
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
  return result[0].label;
};

export const analyzeTone = async (audioData: Float32Array): Promise<AudioAnalysis['tone']> => {
  // Implement audio analysis for pitch, tempo, and energy
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