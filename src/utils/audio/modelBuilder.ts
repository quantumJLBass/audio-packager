import { AudioSettings } from '@/types/audio/settings';

export const buildModelPath = (settings: AudioSettings): string => {
  const selectedModel = settings.supportedModels.find(m => m.id === settings.defaultModel);
  if (!selectedModel) {
    throw new Error('Selected model not found');
  }
  
  return `models/${selectedModel.key}`;
};