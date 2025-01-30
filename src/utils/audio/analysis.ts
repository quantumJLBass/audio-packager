/**
 * Audio analysis utilities for sentiment and tone analysis
 */
import { PretrainedModelOptions, DeviceType, DType } from '@/types/audio/processing';
import { pipeline } from '@huggingface/transformers';
import { getSettings } from '../settings';
import { DebugLogger } from '../debug';

/**
 * Determines the MIME type of an audio file
 * @param audioData - The audio data to analyze
 * @returns The MIME type of the audio file
 */
const determineAudioType = (audioData: ArrayBuffer): string => {
  // Check file signature bytes to determine format
  const header = new Uint8Array(audioData.slice(0, 4));
  
  // WAV: 'RIFF'
  if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) {
    return 'audio/wav';
  }
  
  // MP3: 'ID3' or 0xFF 0xFB
  if ((header[0] === 0x49 && header[1] === 0x44 && header[2] === 0x33) ||
      (header[0] === 0xFF && header[1] === 0xFB)) {
    return 'audio/mp3';
  }
  
  // M4A/AAC: 'ftyp'
  if (header[0] === 0x66 && header[1] === 0x74 && header[2] === 0x79 && header[3] === 0x70) {
    return 'audio/mp4';
  }
  
  // Default to WAV if unknown
  return 'audio/wav';
};

/**
 * Analyzes the sentiment of transcribed audio
 */
export const analyzeSentiment = async (audioData: Float32Array): Promise<string> => {
  const text = await convertAudioToText(audioData);
  if (!text) {
    DebugLogger.log('Sentiment', 'No text to analyze, returning default sentiment');
    return 'neutral';
  }

  DebugLogger.log('Sentiment', 'Analyzing sentiment for text:', text);
  const settings = getSettings();

  const modelOptions: PretrainedModelOptions = {
    device: settings.modelConfig.device,
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    dtype: settings.modelConfig.dtype
  };

  try {
    const classifier = await pipeline(
      "text-classification",
      settings.sentimentAnalysis.model,
      modelOptions
    );
    
    const result = await classifier(text);
    const output = Array.isArray(result) ? result[0] : result;
    const label = ((output as any).label || settings.sentimentAnalysis.defaultLabel).toString();
    
    DebugLogger.log('Sentiment', 'Analysis result:', {
      label,
      confidence: (output as any).score,
      threshold: settings.sentimentAnalysis.thresholds[label]?.value
    });
    
    return label;
  } catch (error) {
    DebugLogger.error('Sentiment', 'Analysis error:', error);
    return settings.sentimentAnalysis.defaultLabel;
  }
};

/**
 * Analyzes the speaking tone of audio
 */
export const analyzeTone = async (audioData: Float32Array): Promise<string> => {
  DebugLogger.log('Tone', 'Starting tone analysis');
  const settings = getSettings();
  
  try {
    const avgAmplitude = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
    
    for (const [tone, threshold] of Object.entries(settings.toneAnalysis.toneThresholds)) {
      if (avgAmplitude > threshold) {
        DebugLogger.log('Tone', `Detected tone: ${tone} (amplitude: ${avgAmplitude})`);
        return tone;
      }
    }
    
    DebugLogger.log('Tone', 'No specific tone detected, using default');
    return settings.toneAnalysis.defaultTone;
  } catch (error) {
    DebugLogger.error('Tone', 'Analysis error:', error);
    return settings.toneAnalysis.defaultTone;
  }
};

/**
 * Converts audio data to text for analysis
 */
async function convertAudioToText(audioData: Float32Array): Promise<string> {
  const settings = getSettings();
  DebugLogger.log('Transcription', 'Converting audio to text');

  const audioBlob = new Blob([audioData], {
    type: determineAudioType(audioData.buffer)
  });
  
  const base64String = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.readAsDataURL(audioBlob);
  });

  try {
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      settings.modelConfig.model,
      {
        device: settings.modelConfig.device,
        revision: settings.modelRevision,
        cache_dir: settings.enableModelCaching ? undefined : null,
        dtype: settings.modelConfig.dtype
      }
    );

    const result = await transcriber(base64String);
    const text = Array.isArray(result) 
      ? result[0]?.text 
      : result.text;
      
    DebugLogger.log('Transcription', 'Converted text:', text);
    return text || '';
  } catch (error) {
    DebugLogger.error('Transcription', 'Conversion error:', error);
    return '';
  }
}