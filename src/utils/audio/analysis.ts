/**
 * Audio analysis utilities for sentiment and tone analysis
 * Processes audio data to determine emotional content and speaking tone
 */

import { PretrainedModelOptions } from '@/types/audio/processing';
import { pipeline } from '@huggingface/transformers';
import { getSettings } from '../settings';
import { DebugLogger } from '../debug';

/**
 * Analyzes the sentiment of transcribed audio
 * @param {Float32Array} audioData - Processed audio data
 * @returns {Promise<string>} Detected sentiment label
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
    device: "webgpu",
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    dtype: "fp32"
  };

  try {
    const classifier = await pipeline(
      "text-classification",
      settings.sentimentAnalysis.model,
      modelOptions
    );
    
    const result = await classifier(text);
    const output = Array.isArray(result) ? result[0] : result;
    const label = ((output as any).label || 'neutral').toString();
    
    DebugLogger.log('Sentiment', 'Analysis result:', {
      label,
      confidence: (output as any).score,
      threshold: settings.sentimentAnalysis.thresholds[label]?.value
    });
    
    return label;
  } catch (error) {
    DebugLogger.error('Sentiment', 'Analysis error:', error);
    return settings.sentimentAnalysis.defaultLabel || 'neutral';
  }
};

/**
 * Analyzes the speaking tone of audio
 * @param {Float32Array} audioData - Processed audio data
 * @returns {Promise<string>} Detected tone label
 */
export const analyzeTone = async (audioData: Float32Array): Promise<string> => {
  DebugLogger.log('Tone', 'Starting tone analysis');
  const settings = getSettings();
  
  try {
    const avgAmplitude = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
    
    // Map amplitude to tone based on configured thresholds
    const { toneThresholds } = settings;
    for (const [tone, threshold] of Object.entries(toneThresholds)) {
      if (avgAmplitude > threshold) {
        DebugLogger.log('Tone', `Detected tone: ${tone} (amplitude: ${avgAmplitude})`);
        return tone;
      }
    }
    
    DebugLogger.log('Tone', 'No specific tone detected, using default');
    return settings.defaultTone;
  } catch (error) {
    DebugLogger.error('Tone', 'Analysis error:', error);
    return settings.defaultTone;
  }
};

/**
 * Converts audio data to text for analysis
 * @param {Float32Array} audioData - Processed audio data
 * @returns {Promise<string>} Transcribed text
 */
async function convertAudioToText(audioData: Float32Array): Promise<string> {
  const settings = getSettings();
  DebugLogger.log('Transcription', 'Converting audio to text');

  const audioBlob = new Blob([audioData], {
    type: settings.audioFormat || 'audio/wav'
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
        device: "webgpu",
        revision: settings.modelRevision,
        cache_dir: settings.enableModelCaching ? undefined : null,
        dtype: "fp32"
      }
    );

    const result = await transcriber(base64String);
    const text = Array.isArray(result) 
      ? result[0]?.chunks?.[0]?.text 
      : result.chunks?.[0]?.text;
      
    DebugLogger.log('Transcription', 'Converted text:', text);
    return text || '';
  } catch (error) {
    DebugLogger.error('Transcription', 'Conversion error:', error);
    return '';
  }
}