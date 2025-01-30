import { PretrainedModelOptions } from '@/types/audio/processing';
import { Transcription } from '@/types/audio/transcription';
import { pipeline } from "@huggingface/transformers";
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../settings';
import { determineAudioTypeFromBuffer, createAudioFileFromBuffer } from './fileType';
import { buildModelPath, createModelConfig, createTranscriptionConfig } from './modelBuilder';
import { DebugLogger } from '../debug';

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  DebugLogger.log('Processing', 'Processing audio buffer');
  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.getChannelData(0);
  } catch (error) {
    DebugLogger.error('Processing', 'Error processing audio buffer:', error);
    throw error;
  }
};

export const transcribeAudio = async (audioData: Float32Array): Promise<Transcription[]> => {
  DebugLogger.log('Transcription', 'Starting transcription');
  const settings = getSettings();

  const audioBuffer = audioData.buffer;
  const audioFile = createAudioFileFromBuffer(audioBuffer);
  
  const base64String = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.readAsDataURL(audioFile);
  });

  try {
    const modelPath = buildModelPath(settings.defaultModel);
    const modelConfig = createModelConfig();
    const transcriptionConfig = createTranscriptionConfig();

    DebugLogger.log('Transcription', 'Using model:', modelPath);

    const transcriber = await pipeline(
      "automatic-speech-recognition",
      modelPath,
      modelConfig
    );

    const result = await transcriber(base64String, transcriptionConfig);
    DebugLogger.log('Transcription', 'Raw result:', result);

    if (!Array.isArray(result) && result.chunks) {
      return result.chunks.map((chunk: any, index: number) => ({
        id: uuidv4(),
        text: chunk.text || settings.noSpeechText,
        start: chunk.timestamp[0] || 0,
        end: chunk.timestamp[1] || 0,
        confidence: chunk.confidence || settings.defaultConfidence,
        speaker: {
          id: settings.speakerIdTemplate.replace('{?}', String(Math.floor(index / 2) + 1)),
          name: settings.speakerNameTemplate.replace('{?}', String(Math.floor(index / 2) + 1)),
          color: settings.speakerColors[Math.floor(index / 2) % settings.speakerColors.length]
        }
      }));
    }

    return [];
  } catch (error) {
    DebugLogger.error('Transcription', 'Error:', error);
    throw error;
  }
};