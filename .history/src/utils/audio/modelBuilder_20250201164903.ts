import { DebugLogger } from '../debug';
import { getSettings } from '../settings';

export const buildModelPath = (modelId: string): string => {
  const settings = getSettings();
  const model = settings.supportedModels.find(m => m.id === modelId);

  if (!model) {
    DebugLogger.error('ModelBuilder', `Model ${modelId} not found in supported models`);
    return settings.defaultModel;
  }

  DebugLogger.log('ModelBuilder', `Building path for model: ${modelId}`);
  const provider = settings.modelConfig.useOnnx ? 'onnx-community' : 'openai';
  const modelName = model.name.toLowerCase().replace(/\s+/g, '-');
  const quantizedSuffix = '';// settings.modelConfig.useQuantized ? '-quantized' : '';
  const onnxSuffix = '';// settings.modelConfig.useOnnx ? '-ONNX' : '';

  const path = `${provider}/${modelName}${quantizedSuffix}${onnxSuffix}`;
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
    dtype: settings.modelConfig.dtype
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
