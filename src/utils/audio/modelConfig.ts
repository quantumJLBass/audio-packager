import { ModelUrlOptions } from '@/types/audio/processing';
import { AudioSettings } from '@/types/audio/settings';

export const getModelPath = (modelId: string, options: ModelUrlOptions): string => {
  const { provider, model } = options;
  return `${provider}/${model}`;
};

export const createModelConfig = (settings: AudioSettings) => {
  return {
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    device: settings.modelConfig.device,
    dtype: settings.modelConfig.dtype,
    isQuantized: settings.modelConfig.useQuantized,
    local_files_only: false
  };
};

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