/**
 * Audio processing utilities for transcription and analysis
 */
import { PretrainedModelOptions } from '@/types/audio/processing';
import { Transcription } from '@/types/audio/transcription';
import { pipeline } from "@huggingface/transformers";
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../settings';
import { determineAudioType } from './fileType';
import { buildModelPath, createModelConfig, createTranscriptionConfig } from './modelBuilder';
import { DebugLogger } from '../debug';

/**
 * Processes an audio buffer into a Float32Array for analysis
 */
export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  DebugLogger.log('Processing', 'Processing audio buffer');
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.getChannelData(0);
};

/**
 * Transcribes audio data into text segments
 */
export const transcribeAudio = async (audioData: Float32Array): Promise<Transcription[]> => {
  DebugLogger.log('Transcription', 'Starting transcription');
  const settings = getSettings();

  const audioBlob = new Blob([audioData], {
    type: determineAudioType(audioData.buffer)
  });
  
  const base64String = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.readAsDataURL(audioBlob);
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