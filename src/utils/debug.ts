import { AudioSettings } from '@/types/audio/settings';

/**
 * Debug logger utility for audio processing
 * Controls logging based on debugMode setting
 */
export class DebugLogger {
  private static settings: AudioSettings;

  /**
   * Initialize logger with settings
   * @param settings AudioSettings containing debugMode flag
   */
  static initialize(settings: AudioSettings) {
    this.settings = settings;
  }

  /**
   * Log message if debug mode is enabled
   * @param category Logging category (e.g., 'Model', 'Processing')
   * @param message Message to log
   * @param data Optional data to log
   */
  static log(category: string, message: string, data?: any) {
    if (this.settings?.debugMode) {
      console.log(`[${category}] ${message}`, data || '');
    }
  }

  /**
   * Log warning if debug mode is enabled
   * @param category Logging category
   * @param message Warning message
   * @param data Optional data
   */
  static warn(category: string, message: string, data?: any) {
    if (this.settings?.debugMode) {
      console.warn(`[${category}] ⚠️ ${message}`, data || '');
    }
  }

  /**
   * Log error if debug mode is enabled
   * @param category Logging category
   * @param message Error message
   * @param error Optional error object
   */
  static error(category: string, message: string, error?: any) {
    if (this.settings?.debugMode) {
      console.error(`[${category}] 🔴 ${message}`, error || '');
    }
  }

  /**
   * Log model path construction details
   * @param modelUrl Constructed model URL
   * @param config Model configuration used
   */
  static logModelPath(modelUrl: string, config: any) {
    this.log('Model', 'Using model path:', { url: modelUrl, config });
  }

  /**
   * Log processing step details
   * @param step Processing step name
   * @param details Step details
   */
  static logProcessingStep(step: string, details?: any) {
    this.log('Processing', `Step: ${step}`, details);
  }

  /**
   * Log sentiment analysis results
   * @param emotion Detected emotion
   * @param score Confidence score
   * @param threshold Configuration threshold
   */
  static logSentimentScore(emotion: string, score: number, threshold: number) {
    this.log('Sentiment', `${emotion}:`, { score, threshold });
  }
}