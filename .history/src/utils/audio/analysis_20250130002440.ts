import { PretrainedModelOptions } from '@/types/audio/processing';
import { pipeline } from '@huggingface/transformers';
import { getSettings } from '../settings';

// todo: missing a lot of the settings AND HAVE HARD CODED VALUES!!
export const analyzeSentiment = async (audioData: Float32Array): Promise<string> => {
  // Convert audio data to text first (simplified for example)
  const text = await convertAudioToText(audioData);
  if (!text) return 'neutral'; // TODO: setting is it not?

  console.log('Analyzing sentiment...');
  const settings = getSettings();

  const modelOptions: PretrainedModelOptions = {
    device: "webgpu", // TODO: setting is it not?
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null // TODO: this doesn't seem right
  };

  try {
    const classifier = await pipeline(
      "text-classification",
      "SamLowe/roberta-base-go_emotions",  // TODO: setting is it not? we would want a classifier model select in the settings right?  with maybe the option to use the ONNX model?
      modelOptions);
    const result = await classifier(text);
    const output = Array.isArray(result) ? result[0] : result;
    return ((output as any).label || 'neutral').toString();
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return 'neutral'; // TODO: setting is it not?
  }
};

export const analyzeTone = async (audioData: Float32Array): Promise<string> => {
  console.log('Analyzing audio tone...');
  try {
    // Basic tone analysis based on audio characteristics
    const avgAmplitude = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
    // would we want to be able to have a array of values in the settings we can map to?  so we can adjust the values for the tone? or the labels?
    if (avgAmplitude > 0.5) return 'energetic'; // TODO: setting is it not?
    if (avgAmplitude > 0.3) return 'moderate'; // TODO: setting is it not?
    return 'calm'; // TODO: setting is it not?
  } catch (error) {
    console.error('Tone analysis error:', error);
    return 'neutral'; // TODO: setting is it not?
  }
};

// Helper function to convert audio to text
async function convertAudioToText(audioData: Float32Array): Promise<string> {
  const settings = getSettings();

  // Convert Float32Array to base64 string for the model
  const audioBlob = new Blob([audioData], {
    type: 'audio/wav'  // TODO: we should be able to determine the type from the audio file itself
  });
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
      "openai/whisper-small",  // TODO: we should build the model value from this or the selected item from the supportedModels array with the option to use the ONNX model and or the quantized model
      {
        device: "webgpu", // TODO: setting is it not?
        revision: settings.modelRevision, // TODO: setting is it not?
        cache_dir: settings.enableModelCaching ? undefined : null // TODO: setting is it not?
      }
    );

    const result = await transcriber(base64String);
    if (Array.isArray(result)) {
      return result[0]?.chunks?.[0]?.text || '';
    }
    return result.chunks?.[0]?.text || '';
  } catch (error) {
    console.error('Audio to text conversion error:', error);
    return '';
  }
}
