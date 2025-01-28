import { pipeline } from "@huggingface/transformers";
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../settings';
import { Transcription } from '@/types/audio/transcription';
import { PretrainedModelOptions } from '@/types/audio/processing';

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  console.log('Processing audio buffer...');
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const channelData = audioBuffer.getChannelData(0);
  return channelData;
};

export const transcribeAudio = async (audioData: Float32Array): Promise<Transcription[]> => {
  console.log('Transcribing audio...');
  const settings = getSettings();
  
  const modelOptions: PretrainedModelOptions = {
    device: "webgpu",
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    dtype: "fp32"
  };

  try {
    // Use a better model for transcription
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "openai/whisper-small",
      modelOptions
    );

    const result = await transcriber(audioData, {
      chunk_length_s: settings.defaultChunkLength,
      stride_length_s: settings.defaultStrideLength,
      return_timestamps: true
    });

    console.log('Transcription result:', result);
    
    if (!Array.isArray(result) && result.chunks) {
      return result.chunks.map((chunk: any, index: number) => ({
        id: uuidv4(),
        text: chunk.text || settings.noSpeechText,
        start: chunk.timestamp[0] || 0,
        end: chunk.timestamp[1] || 0,
        confidence: chunk.confidence || settings.defaultConfidence,
        speaker: {
          id: `speaker-${Math.floor(index / 2) + 1}`,
          name: `Speaker ${Math.floor(index / 2) + 1}`,
          color: settings.speakerColors[Math.floor(index / 2) % settings.speakerColors.length]
        }
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};