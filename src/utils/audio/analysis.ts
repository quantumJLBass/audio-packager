import { pipeline, TextClassificationOutput, AudioClassificationOutput } from '@huggingface/transformers';
import { getSettings } from '../settings';
import { PretrainedModelOptions } from '@/types/audio/processing';

export const analyzeSentiment = async (text: string): Promise<string> => {
  console.log('Analyzing sentiment...');
  const settings = getSettings();
  
  const modelOptions: PretrainedModelOptions = {
    device: "webgpu",
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null
  };

  try {
    const classifier = await pipeline("text-classification", settings.sentimentModel, modelOptions);
    const result = await classifier(text);
    const output = Array.isArray(result) ? result[0] : result;
    return (output as TextClassificationOutput).scores[0].toString();
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    throw error;
  }
};

export const analyzeTone = async (audioData: Float32Array): Promise<string> => {
  console.log('Analyzing audio tone...');
  const settings = getSettings();
  
  const modelOptions: PretrainedModelOptions = {
    device: "webgpu",
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    dtype: "fp32"
  };

  try {
    const analyzer = await pipeline("audio-classification", settings.defaultModel, modelOptions);
    const result = await analyzer(audioData);
    const output = Array.isArray(result) ? result[0] : result;
    return ((output as AudioClassificationOutput).scores[0] || 'neutral').toString().toLowerCase();
  } catch (error) {
    console.error('Tone analysis error:', error);
    return 'neutral';
  }
};