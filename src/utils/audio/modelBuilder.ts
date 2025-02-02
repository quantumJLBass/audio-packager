import { AudioSettings } from '@/types/audio/settings';
import { DebugLogger } from '../debug';

export const buildModelPath = (settings: AudioSettings): string => {
  const selectedModel = settings.supportedModels.find(m => m.id === settings.defaultModel);
  if (!selectedModel) {
    DebugLogger.warn('ModelBuilder', `Model ${settings.defaultModel} not found, falling back to default`);
    return 'onnx-community/whisper-large-v3-turbo_timestamped';
  }

  const modelPath = `${selectedModel.provider}/${selectedModel.key}`;
  DebugLogger.log('ModelBuilder', `Built model path: ${modelPath}`);
  return modelPath;
};

export const createModelConfig = (settings: AudioSettings) => {
  DebugLogger.log('ModelBuilder', 'Creating model config with settings:', {
    device: settings.modelConfig.device,
    dtype: settings.modelConfig.dtype,
    revision: settings.modelRevision,
    caching: settings.enableModelCaching
  });

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
  DebugLogger.log('ModelBuilder', 'Creating transcription config with settings:', {
    language: settings.defaultLanguage,
    task: settings.processingTask,
    chunkLength: settings.defaultChunkLength,
    strideLength: settings.defaultStrideLength,
    returnTimestamps: settings.returnTimestamps
  });

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