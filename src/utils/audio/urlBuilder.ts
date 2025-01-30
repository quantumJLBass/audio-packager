import { AudioSettings } from '@/types/audio/settings';

export interface ModelUrlOptions {
  provider: string;
  model: string;
  isQuantized?: boolean;
  isOnnx?: boolean;
  language?: string;
}

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

  return `${provider}/whisper-${model}${langSuffix}${quantizedSuffix}${modelSuffix}`;
};

export const buildConfigUrl = (modelUrl: string): string => {
  return `https://huggingface.co/${modelUrl}/resolve/main/config.json`;
};

export const buildOnnxModelUrls = (modelUrl: string) => {
  const base = `https://huggingface.co/${modelUrl}/resolve/main/onnx`;
  return {
    encoder: `${base}/encoder_model_quantized.onnx`,
    decoder: `${base}/decoder_model_merged_quantized.onnx`
  };
};

export const buildSentimentModelUrl = (settings: AudioSettings): string => {
  const { provider, model } = settings.sentimentAnalysis;
  return `${provider}/${model}${settings.useOnnx ? '-onnx' : ''}`;
};