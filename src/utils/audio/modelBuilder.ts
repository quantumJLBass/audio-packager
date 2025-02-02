import { DebugLogger } from '../debug';
import { getSettings } from '../settings';

export const buildModelPath = (modelId: string | number): string => {
  const settings = getSettings();
  
  // First try to find by numeric id
  let model = typeof modelId === 'number' ? 
    settings.supportedModels.find(m => m.id === modelId) :
    settings.supportedModels.find(m => m.key === modelId);

  if (!model) {
    DebugLogger.error('ModelBuilder', `Model ${modelId} not found in supported models`);
    // Find default model
    model = settings.supportedModels.find(m => m.key === settings.defaultModel) ||
            settings.supportedModels[0]; // Fallback to first model if default not found
  }

  DebugLogger.log('ModelBuilder', `Building path for model: ${model.key}`);

  // Ensure we're using the correct provider and model format
  const path = `${model.provider}/${model.key}`;
  DebugLogger.log('ModelBuilder', `Built model path: ${path}`);
  return path;
};

export const createModelConfig = () => {
  const settings = getSettings();
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
    local_files_only: true
  };
};

export const createTranscriptionConfig = () => {
  const settings = getSettings();
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