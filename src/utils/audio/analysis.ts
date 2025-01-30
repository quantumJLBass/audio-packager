/**
 * Audio analysis utilities for sentiment and tone analysis
 */
import { PretrainedModelOptions } from '@/types/audio/processing';
import { pipeline } from '@huggingface/transformers';
import { getSettings } from '../settings';
import { DebugLogger } from '../debug';
import { determineAudioType } from './fileType';
import { buildModelPath, createModelConfig, createTranscriptionConfig } from './modelBuilder';

/**
 * Analyzes the sentiment of transcribed audio
 */
export const analyzeSentiment = async (audioData: Float32Array): Promise<string> => {
  const text = await convertAudioToText(audioData);
  if (!text) {
    DebugLogger.log('Sentiment', 'No text to analyze, returning default sentiment');
    const settings = getSettings();
    return settings.sentimentAnalysis.defaultLabel;
  }

  DebugLogger.log('Sentiment', 'Analyzing sentiment for text:', text);
  const settings = getSettings();
  const modelConfig = createModelConfig();

  try {
    const classifier = await pipeline(
      "text-classification",
      settings.sentimentAnalysis.model,
      modelConfig
    );
    
    const result = await classifier(text);
    const output = Array.isArray(result) ? result[0] : result;
    const label = ((output as any).label || settings.sentimentAnalysis.defaultLabel).toString();
    
    DebugLogger.log('Sentiment', 'Analysis result:', {
      label,
      confidence: (output as any).score,
      threshold: settings.sentimentAnalysis.thresholds[label]?.value || 0
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
    const thresholds = settings.toneAnalysis.toneThresholds;
    
    for (const [tone, threshold] of Object.entries(thresholds)) {
      if (typeof threshold === 'number' && avgAmplitude > threshold) {
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
    const modelPath = buildModelPath(settings.defaultModel);
    const modelConfig = createModelConfig();
    const transcriptionConfig = createTranscriptionConfig();
    
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      modelPath,
      modelConfig
    );

    const result = await transcriber(base64String, transcriptionConfig);
    
    if (Array.isArray(result)) {
      return result[0]?.text || '';
    }
    return result.text || '';
  } catch (error) {
    DebugLogger.error('Transcription', 'Conversion error:', error);
    return '';
  }
}