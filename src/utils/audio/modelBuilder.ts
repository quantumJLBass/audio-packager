import { ModelUrlOptions } from '@/types/audio/processing';
import { AudioSettings } from '@/types/audio/settings';

export const buildModelPath = (modelId: number): string => {
  const settings = getSettings();
  const selectedModel = settings.supportedModels.find(m => m.id === modelId);
  
  if (!selectedModel) {
    throw new Error(`Model with ID ${modelId} not found`);
  }

  return `${selectedModel.provider}/${selectedModel.key}`;
};

export const createModelConfig = (settings: AudioSettings) => ({
  device: settings.modelConfig.device,
  revision: settings.modelRevision,
  cache_dir: settings.enableModelCaching ? undefined : null,
  dtype: settings.modelConfig.dtype
});

export const createTranscriptionConfig = (settings: AudioSettings) => ({
  language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
  task: settings.processingTask,
  chunk_length_s: settings.defaultChunkLength,
  stride_length_s: settings.defaultStrideLength,
  return_timestamps: settings.returnTimestamps
});