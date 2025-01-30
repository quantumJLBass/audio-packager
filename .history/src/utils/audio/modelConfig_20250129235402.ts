import { AudioSettings } from '@/types/audio/settings';

// todo: missing a lot of the settings AND HAVE HARD CODED VALUES!!

export const getModelPath = (modelId: string): string => {
  // Use the ONNX-specific model repository
  return 'onnx-community/whisper-tiny.en'; // setting is it not? DO NOT HARD CODE ANYTHING ANY MORE UNLESS IT IS IN THE SETTINGS FILE. JUST STOP IT, THIS IS A BAD PRACTICE
};

export const createModelConfig = (settings: AudioSettings) => {
  return {
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    device: "webgpu" as const, // setting is it not?
    dtype: "fp32" as const // setting is it not?
  };
};
// todo: missing a lot of the settings here are we not?
export const createTranscriptionConfig = (settings: AudioSettings) => {
  return {
    language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
    task: "transcribe" as const,
    chunk_length_s: settings.defaultChunkLength,
    stride_length_s: settings.defaultStrideLength,
    return_timestamps: true, // setting is it not?
    max_new_tokens: 128, // setting is it not?
    num_beams: 1, // setting is it not?
    temperature: 0, // setting is it not?
    no_repeat_ngram_size: 3 // setting is it not?
  };
};
