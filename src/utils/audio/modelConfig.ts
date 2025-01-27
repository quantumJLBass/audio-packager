import { AudioSettings } from '@/utils/settings';

export const getModelPath = (modelId: string): string => {
  // Use a smaller model that's more likely to work in the browser
  return `openai/whisper-small`;
};

export const createModelConfig = (settings: AudioSettings) => {
  return {
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    device: "webgpu",
    dtype: "fp32" as const
  };
};

export const createTranscriptionConfig = (settings: AudioSettings) => {
  return {
    language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
    task: "transcribe" as const,
    chunk_length_s: settings.defaultChunkLength,
    stride_length_s: settings.defaultStrideLength,
    return_timestamps: true,
    max_new_tokens: 448,
    num_beams: 1,
    temperature: 0,
    no_repeat_ngram_size: 3
  };
};