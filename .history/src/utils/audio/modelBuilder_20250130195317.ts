import { DebugLogger } from '../debug';
import { getSettings } from '../settings';

export const buildModelPath = (modelId: string): string => {
  const settings = getSettings();
  const model = settings.supportedModels.find(m => m.id === modelId);

  if (!model) {
    DebugLogger.error('ModelBuilder', `Model ${modelId} not found in supported models`);
    return settings.defaultModel;
  }

  //const provider = settings.modelConfig.useOnnx ? 'onnx-community' : 'openai';
  //const modelName = model.name.toLowerCase().replace(/\s+/g, '-');
  // const quantizedSuffix = settings.modelConfig.useQuantized ? '-quantized' : '';
  // const onnxSuffix = settings.modelConfig.useOnnx ? '-ONNX' : '';

  return `${model.provider}/${model.id}`;
};

export const createModelConfig = () => {
  const settings = getSettings();

  return {
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    device: settings.modelConfig.device,
    dtype: settings.modelConfig.dtype
  };
};

export const createTranscriptionConfig = () => {
  const settings = getSettings();

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
