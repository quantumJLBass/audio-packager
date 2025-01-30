import { Transcription } from '@/types/audio/transcription';
import { pipeline } from "@huggingface/transformers";
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../settings';
import { buildModelPath } from './modelBuilder';

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  console.log('Processing audio buffer...');
  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log('Audio buffer processed successfully');
    return audioBuffer.getChannelData(0);
  } catch (error) {
    console.error('Error processing audio buffer:', error);
    throw new Error('Failed to process audio buffer');
  }
};

export const transcribeAudio = async (audioData: Float32Array): Promise<Transcription[]> => {
  const settings = getSettings();
  console.log('Starting transcription with settings:', settings);

  try {
    // Use a simpler model that's more reliable
    //const modelPath = "Xenova/whisper-tiny.en";

    const modelPath = buildModelPath(settings.defaultModel);
    console.log('Using model path:', modelPath);

    const transcriber = await pipeline(
      "automatic-speech-recognition",
      modelPath,
      {
        device: settings.modelConfig.device, // Fallback to CPU for reliability
        revision: settings.modelRevision,
        quantized: settings.modelConfig.useQuantized
      }
    );

    // Convert Float32Array to base64 for the model
    const audioBlob = new Blob([audioData], {
      type: 'audio/wav'
    });
    const base64String = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.readAsDataURL(audioBlob);
    });

    const result = await transcriber(base64String, {
      language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
      task:settings.processingTask,
      chunk_length_s: settings.defaultChunkLength,
      stride_length_s: settings.defaultStrideLength,
      return_timestamps: settings.returnTimestamps
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
          id: settings.speakerIdTemplate.replace('{idx}', `${Math.floor(index / 2) + 1}`),
          name: settings.speakerNameTemplate.replace('{idx}', `${Math.floor(index /2) + 1}'`),
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
