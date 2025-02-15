import { AudioSettings } from '@/types/audio/settings';

export const getModelPath = (modelId: string): string => {
  // Use the ONNX-specific model repository
  return 'onnx-community/whisper-tiny.en';
};

export const createModelConfig = (settings: AudioSettings) => {
  return {
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    device: "webgpu" as const,
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
    max_new_tokens: 128,
    num_beams: 1,
    temperature: 0,
    no_repeat_ngram_size: 3
  };
};