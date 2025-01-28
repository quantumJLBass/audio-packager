import { pipeline } from '@huggingface/transformers';
import { getSettings } from '../settings';
import { PretrainedModelOptions } from '@/types/audio/processing';

export const analyzeSentiment = async (audioData: Float32Array): Promise<string> => {
  // Convert audio data to text first (simplified for example)
  const text = await convertAudioToText(audioData);
  if (!text) return 'neutral';
  
  console.log('Analyzing sentiment...');
  const settings = getSettings();
  
  const modelOptions: PretrainedModelOptions = {
    device: "webgpu",
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null
  };

  try {
    const classifier = await pipeline("text-classification", "SamLowe/roberta-base-go_emotions", modelOptions);
    const result = await classifier(text);
    const output = Array.isArray(result) ? result[0] : result;
    return ((output as any).label || 'neutral').toString();
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return 'neutral';
  }
};

export const analyzeTone = async (audioData: Float32Array): Promise<string> => {
  console.log('Analyzing audio tone...');
  try {
    // Basic tone analysis based on audio characteristics
    const avgAmplitude = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
    
    if (avgAmplitude > 0.5) return 'energetic';
    if (avgAmplitude > 0.3) return 'moderate';
    return 'calm';
  } catch (error) {
    console.error('Tone analysis error:', error);
    return 'neutral';
  }
};

// Helper function to convert audio to text
async function convertAudioToText(audioData: Float32Array): Promise<string> {
  const settings = getSettings();
  
  // Convert Float32Array to base64 string for the model
  const audioBlob = new Blob([audioData], { type: 'audio/wav' });
  const base64String = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remove data URL prefix
    };
    reader.readAsDataURL(audioBlob);
  });

  try {
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "openai/whisper-small",
      {
        device: "webgpu",
        revision: settings.modelRevision,
        cache_dir: settings.enableModelCaching ? undefined : null
      }
    );

    const result = await transcriber(base64String);
    return typeof result === 'string' ? result : result.text || '';
  } catch (error) {
    console.error('Audio to text conversion error:', error);
    return '';
  }
}