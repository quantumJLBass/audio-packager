import { pipeline } from '@huggingface/transformers';
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
    return Array.isArray(result) ? result[0].label : result.label;
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
    // Initialize the audio analysis pipeline
    const analyzer = await pipeline("audio-classification", settings.defaultModel, modelOptions);
    
    // Process the audio data
    const result = await analyzer(audioData, {
      return_all_scores: true,
      top_k: 1
    });

    // Extract the dominant tone
    const tone = Array.isArray(result) 
      ? result[0].label 
      : (result as any).label || 'neutral';

    return tone.toLowerCase();
  } catch (error) {
    console.error('Tone analysis error:', error);
    return 'neutral';
  }
};