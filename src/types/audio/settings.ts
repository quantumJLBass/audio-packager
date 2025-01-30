import { Transcription } from './transcription';
import { DeviceType, DType, ProcessingTask } from './processing';

/**
 * Metrics for sentiment analysis performance
 */
export interface SentimentMetrics {
  value: number;
  precision: number;
  recall: number;
  f1: number;
}

/**
 * Configuration for sentiment analysis
 */
export interface SentimentConfig {
  provider: string;
  model: string;
  defaultLabel: string;
  thresholds: {
    [emotion: string]: SentimentMetrics;
  };
}

/**
 * Configuration for tone analysis
 */
export interface ToneConfig {
  defaultTone: string;
  toneThresholds: {
    [tone: string]: number;
  };
}

/**
 * Complete audio processing settings
 */
export interface AudioSettings {
  // Debug Mode
  debugMode: boolean;

  // API Keys
  huggingFaceToken: string;
  openAIKey: string;

  // Model Configuration
  modelConfig: {
    provider: string;
    model: string;
    useOnnx: boolean;
    useQuantized: boolean;
    device: DeviceType;
    dtype: DType;
  };
  
  // Sentiment Analysis
  sentimentAnalysis: SentimentConfig;
  
  // Tone Analysis
  toneAnalysis: ToneConfig;

  // Audio Processing
  audioSampleRate: number;
  fftSize: number;
  minPitchLag: number;
  maxPitchLag: number;
  onsetThreshold: number;
  defaultPitch: number;
  defaultTempo: number;
  defaultConfidence: number;
  noSpeechText: string;
  defaultModel: string;
  
  // Processing Options
  processingTask: ProcessingTask;
  defaultChunkLength: number;
  defaultStrideLength: number;
  defaultFloatingPoint: number;
  defaultDiarization: boolean;
  returnTimestamps: boolean;
  maxNewTokens: number;
  numBeams: number;
  temperature: number;
  noRepeatNgramSize: number;

  // Model Settings
  supportedModels: Array<{
    id: string;
    name: string;
  }>;
  modelRevision: string;
  enableModelCaching: boolean;
  sentimentModel: string;
  supportedLanguages: Array<{
    code: string;
    name: string;
  }>;
  defaultLanguage: string;

  // Speaker Settings
  speakerIdTemplate: string;
  speakerNameTemplate: string;
  speakerColors: string[];
  maxSpeakers: number;

  // Visualization
  waveformColors: {
    background: string;
    waveform: string;
    progress: string;
    cursor: string;
  };
  waveformHeight: number;
  minPxPerSec: number;

  // Volume Settings
  minVolume: number;
  maxVolume: number;
  volumeStep: number;

  // Zoom Settings
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  zoomStep: number;

  // Time Format
  timeFormat: string;
  showMilliseconds: boolean;

  // Initial State
  initialState: {
    currentTime: number;
    isPlaying: boolean;
    duration: number;
    isReady: boolean;
    isTranscribing: boolean;
    transcriptions: Transcription[];
    error: string | null;
  };
}