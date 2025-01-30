/**
 * Configuration utilities for audio processing models
 */
import { AudioSettings } from '@/types/audio/settings';
import { ModelUrlOptions } from '@/types/audio/processing';

/**
 * Constructs the model path based on configuration
 */
export const getModelPath = (modelId: string, options: ModelUrlOptions): string => {
  const { provider, model, isQuantized, isOnnx, language } = options;
  const modelPrefix = isOnnx ? 'onnx-' : '';
  const modelSuffix = isQuantized ? '-quantized' : '';
  const languageSuffix = language ? `.${language}` : '';
  
  return `${provider}/${modelPrefix}${model}${modelSuffix}${languageSuffix}`;
};

/**
 * Creates model configuration based on settings
 */
export const createModelConfig = (settings: AudioSettings) => {
  return {
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    device: settings.modelConfig.device,
    dtype: settings.modelConfig.dtype
  };
};

/**
 * Creates transcription configuration based on settings
 */
export const createTranscriptionConfig = (settings: AudioSettings) => {
  return {
    language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
    task: settings.processingTask,
    chunk_length_s: settings.defaultChunkLength,
    stride_length_s: settings.defaultStrideLength,
    return_timestamps: settings.returnTimestamps,
    max_new_tokens: settings.maxNewTokens,
    num_beams: settings.numBeams,
    temperature: settings.temperature,
    no_repeat_ngram_size: settings.noRepeatNgramSize
  };
};