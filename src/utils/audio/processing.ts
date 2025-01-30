/**
 * Audio processing utilities for transcription and analysis
 * Handles audio buffer processing, transcription, and related operations
 */

import { PretrainedModelOptions } from '@/types/audio/processing';
import { Transcription } from '@/types/audio/transcription';
import { pipeline, AutomaticSpeechRecognitionOutput } from "@huggingface/transformers";
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../settings';
import { buildModelUrl, buildConfigUrl } from './urlBuilder';
import { DebugLogger } from '../debug';

/**
 * Processes an audio buffer into a Float32Array for analysis
 * @param {ArrayBuffer} arrayBuffer - Raw audio data
 * @returns {Promise<Float32Array>} Processed audio data
 */
export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  DebugLogger.logProcessingStep('Processing audio buffer');
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.getChannelData(0);
};

/**
 * Transcribes audio data into text segments
 * @param {Float32Array} audioData - Processed audio data
 * @returns {Promise<Transcription[]>} Array of transcription segments
 */
export const transcribeAudio = async (audioData: Float32Array): Promise<Transcription[]> => {
  DebugLogger.logProcessingStep('Starting transcription');
  const settings = getSettings();

  const modelOptions: PretrainedModelOptions = {
    device: "webgpu",
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    dtype: "fp32"
  };

  try {
    const modelUrl = buildModelUrl({
      provider: settings.modelConfig.provider,
      model: settings.modelConfig.model,
      isQuantized: settings.modelConfig.useQuantized,
      isOnnx: settings.modelConfig.useOnnx,
      language: settings.defaultLanguage
    });

    DebugLogger.logModelPath(modelUrl);

    const transcriber = await pipeline(
      "automatic-speech-recognition",
      modelUrl,
      modelOptions
    );

    const result = await transcriber(audioData, {
      chunk_length_s: settings.defaultChunkLength,
      stride_length_s: settings.defaultStrideLength,
      return_timestamps: settings.returnTimestamps,
      max_new_tokens: settings.maxNewTokens,
      num_beams: settings.numBeams,
      temperature: settings.temperature,
      no_repeat_ngram_size: settings.noRepeatNgramSize
    });

    DebugLogger.log('Transcription result:', result);

    // Handle the result based on its type
    const chunks = Array.isArray(result) ? result[0].chunks : result.chunks;
    
    if (!chunks) return [];

    return chunks.map((chunk: any, index: number) => ({
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
  } catch (error) {
    DebugLogger.error('Transcription error:', error);
    throw error;
  }
};