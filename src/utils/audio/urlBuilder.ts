import { ModelConfig } from '@/types/audio/processing';
import { DebugLogger } from '../debug';

/**
 * Options for building model URLs
 */
export interface ModelUrlOptions {
  provider: string;
  model: string;
  isQuantized?: boolean;
  isOnnx?: boolean;
  language?: string;
}

/**
 * Builds the base model URL based on configuration
 * @param options Model URL configuration options
 * @returns Constructed model URL
 */
export const buildModelUrl = (options: ModelUrlOptions): string => {
  const {
    provider,
    model,
    isQuantized = false,
    isOnnx = false,
    language
  } = options;

  const modelSuffix = isOnnx ? '-ONNX' : '';
  const quantizedSuffix = isQuantized ? '-quantized' : '';
  const langSuffix = language ? `.${language}` : '';

  const url = `${provider}/whisper-${model}${langSuffix}${quantizedSuffix}${modelSuffix}`;
  
  DebugLogger.log('URL Builder', 'Built model URL:', url);
  return url;
};

/**
 * Builds the configuration URL for a model
 * @param modelUrl Base model URL
 * @returns Configuration file URL
 */
export const buildConfigUrl = (modelUrl: string): string => {
  const url = `https://huggingface.co/${modelUrl}/resolve/main/config.json`;
  DebugLogger.log('URL Builder', 'Built config URL:', url);
  return url;
};

/**
 * Builds URLs for ONNX model files
 * @param modelUrl Base model URL
 * @returns Object containing encoder and decoder URLs
 */
export const buildOnnxModelUrls = (modelUrl: string) => {
  const base = `https://huggingface.co/${modelUrl}/resolve/main/onnx`;
  const urls = {
    encoder: `${base}/encoder_model_quantized.onnx`,
    decoder: `${base}/decoder_model_merged_quantized.onnx`
  };
  
  DebugLogger.log('URL Builder', 'Built ONNX URLs:', urls);
  return urls;
};

/**
 * Builds sentiment model URL based on settings
 * @param config Sentiment analysis configuration
 * @param useOnnx Whether to use ONNX version
 * @returns Sentiment model URL
 */
export const buildSentimentModelUrl = (config: { provider: string; model: string }, useOnnx: boolean): string => {
  const { provider, model } = config;
  const url = `${provider}/${model}${useOnnx ? '-onnx' : ''}`;
  
  DebugLogger.log('URL Builder', 'Built sentiment model URL:', url);
  return url;
};