/**
 * URL builder utilities for model and configuration paths
 * Constructs URLs for accessing models and their configurations
 */

import { ModelUrlOptions } from '@/types/audio/processing';
import { DebugLogger } from '../debug';

/**
 * Builds the complete model URL based on configuration
 * @param {ModelUrlOptions} options - Configuration for model URL
 * @returns {string} Constructed model URL
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
  const langSuffix = language && language !== 'auto' ? `.${language}` : '';

  const url = `${provider}/whisper-${model}${langSuffix}${quantizedSuffix}${modelSuffix}`;
  
  DebugLogger.log('URL Builder', 'Built model URL:', url);
  return url;
};

/**
 * Builds the configuration URL for a model
 * @param {string} modelUrl - Base model URL
 * @returns {string} Configuration file URL
 */
export const buildConfigUrl = (modelUrl: string): string => {
  const url = `https://huggingface.co/${modelUrl}/resolve/main/config.json`;
  DebugLogger.log('URL Builder', 'Built config URL:', url);
  return url;
};

/**
 * Builds URLs for ONNX model files
 * @param {string} modelUrl - Base model URL
 * @returns {{ encoder: string, decoder: string }} ONNX model URLs
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