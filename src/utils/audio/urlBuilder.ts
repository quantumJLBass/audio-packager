import { ModelUrlOptions } from '@/types/audio/processing';
import { DebugLogger } from '../debug';

export const buildModelUrl = (options: ModelUrlOptions): string => {
  const { provider, model } = options;
  const url = `${provider}/${model}`;
  DebugLogger.log('URL Builder', 'Built model URL:', url);
  return url;
};

export const buildConfigUrl = (modelUrl: string): string => {
  const url = `https://huggingface.co/${modelUrl}/resolve/main/config.json`;
  DebugLogger.log('URL Builder', 'Built config URL:', url);
  return url;
};

export const buildOnnxModelUrls = (modelUrl: string) => {
  const base = `https://huggingface.co/${modelUrl}/resolve/main/onnx`;
  const urls = {
    encoder: `${base}/encoder_model.onnx`,
    decoder: `${base}/decoder_model_merged.onnx`
  };

  DebugLogger.log('URL Builder', 'Built ONNX URLs:', urls);
  return urls;
};