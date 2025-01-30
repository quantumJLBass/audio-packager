import { Transcription } from './transcription';

export interface ModelConfig {
  provider: string;
  model: string;
  useOnnx: boolean;
  useQuantized: boolean;
  device: 'webgpu' | 'cpu' | 'wasm';
  dtype: 'fp16' | 'fp32';
}

export interface SentimentConfig {
  provider: string;
  model: string;
  thresholds: {
    [emotion: string]: number;
  };
}

export interface AudioSettings {
  // Debug Mode
  debugMode: boolean;

  // API Keys
  huggingFaceToken: string;
  openAIKey: string;

  // Model Configuration
  modelConfig: ModelConfig;
  sentimentAnalysis: SentimentConfig;
  
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
  useOnnx: boolean;

  // Speaker Settings
  speakerIdTemplate: string;
  speakerNameTemplate: string;
  speakerColors: string[];
  maxSpeakers: number;

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

  // Visualization
  waveformColors: {
    background: string;
    waveform: string;
    progress: string;
    cursor: string;
  };
  waveformHeight: number;

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

  // Processing Options
  defaultChunkLength: number;
  defaultStrideLength: number;
  defaultFloatingPoint: number;
  defaultDiarization: boolean;
  returnTimestamps: boolean;
  maxNewTokens: number;
  numBeams: number;
  temperature: number;
  noRepeatNgramSize: number;

  minPxPerSec: number;
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