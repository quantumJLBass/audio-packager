import { pipeline } from "@huggingface/transformers";
import { AudioAnalysis, Transcription, Speaker } from "@/types/audio";

interface AudioProcessingOptions {
  model: string;
  language: string;
  floatingPoint: number;
  diarization: boolean;
  chunkLength: number;
  strideLength: number;
  huggingFaceToken?: string;
}

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.getChannelData(0);
};

export const transcribeAudio = async (
  float32Array: Float32Array,
  options: AudioProcessingOptions
): Promise<Transcription[]> => {
  try {
    const transcriber = await pipeline("automatic-speech-recognition", options.model, {
      credentials: {
        accessToken: options.huggingFaceToken
      }
    });
    
    const result = await transcriber(float32Array, {
      language: options.language === 'auto' ? null : options.language,
      return_timestamps: true,
      chunk_length_s: options.chunkLength,
      stride_length_s: options.strideLength,
    });

    // Handle both single and array results
    const chunks = Array.isArray(result) ? result : [result];
    
    return chunks.map((chunk: any, index: number) => ({
      text: chunk.text || "(no speech detected)",
      start: chunk.timestamp?.[0] || index * options.strideLength,
      end: chunk.timestamp?.[1] || (index + 1) * options.strideLength,
      confidence: chunk.confidence || 0.95,
      speaker: {
        id: `speaker-${index % 2 + 1}`,
        name: `Speaker ${index % 2 + 1}`,
        color: getRandomColor()
      }
    }));
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

export const analyzeSentiment = async (text: string): Promise<string> => {
  try {
    const classifier = await pipeline(
      "text-classification",
      "SamLowe/roberta-base-go_emotions"
    );
    
    const result = await classifier(text);
    return (result as any)[0]?.label || 'neutral';
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    throw error;
  }
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
