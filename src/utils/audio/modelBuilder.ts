/**
 * Utility functions for building model paths and configurations
 * @module audio/modelBuilder
 */
import { DeviceType, DType, ModelUrlOptions } from '@/types/audio/processing';
import { getSettings } from '../settings';
import { DebugLogger } from '../debug';

/**
 * Builds the complete model path based on model ID and settings
 * @param modelId - The ID of the model to build path for
 * @returns Complete model path string
 */
export const buildModelPath = (modelId: string): string => {
  const settings = getSettings();
  const model = settings.supportedModels.find(m => m.id === modelId);
  
  if (!model) {
    DebugLogger.warn('ModelBuilder', `Model ${modelId} not found in supported models, using default`);
    return settings.defaultModel;
  }

  DebugLogger.log('ModelBuilder', `Building path for model: ${modelId}`, model);
  
  const provider = settings.modelConfig.useOnnx ? 'onnx-community' : model.provider;
  const modelName = model.name.toLowerCase().replace(/\s+/g, '-');
  const quantizedSuffix = settings.modelConfig.useQuantized ? '-quantized' : '';
  const onnxSuffix = settings.modelConfig.useOnnx ? '-ONNX' : '';
  
  const path = `${provider}/${modelName}${quantizedSuffix}${onnxSuffix}`;
  DebugLogger.log('ModelBuilder', `Built model path: ${path}`);
  return path;
};

/**
 * Creates model configuration based on current settings
 * @returns Model configuration object
 */
export const createModelConfig = () => {
  const settings = getSettings();
  const config = {
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    device: settings.modelConfig.device,
    dtype: settings.modelConfig.dtype
  };
  
  DebugLogger.log('ModelBuilder', 'Created model config:', config);
  return config;
};

/**
 * Creates transcription configuration based on current settings
 * @returns Transcription configuration object
 */
export const createTranscriptionConfig = () => {
  const settings = getSettings();
  const config = {
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
  
  DebugLogger.log('ModelBuilder', 'Created transcription config:', config);
  return config;
};