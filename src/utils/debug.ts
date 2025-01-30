import { AudioSettings } from '@/types/audio/settings';

export class DebugLogger {
  private static settings: AudioSettings;

  static initialize(settings: AudioSettings) {
    this.settings = settings;
  }

  static log(message: string, data?: any) {
    if (this.settings?.debugMode) {
      console.log(`[Debug] ${message}`, data || '');
    }
  }

  static warn(message: string, data?: any) {
    if (this.settings?.debugMode) {
      console.warn(`[Debug Warning] ${message}`, data || '');
    }
  }

  static error(message: string, error?: any) {
    if (this.settings?.debugMode) {
      console.error(`[Debug Error] ${message}`, error || '');
    }
  }

  static logModelPath(modelUrl: string) {
    this.log('Using model path:', modelUrl);
  }

  static logProcessingStep(step: string, details?: any) {
    this.log(`Processing step: ${step}`, details);
  }

  static logSentimentScore(emotion: string, score: number, threshold: number) {
    this.log(`Sentiment ${emotion}:`, { score, threshold });
  }
}