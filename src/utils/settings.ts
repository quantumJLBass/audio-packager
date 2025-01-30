import { Transcription } from '@/types/audio/transcription';

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

const defaultSettings: AudioSettings = {
  debugMode: false,
  huggingFaceToken: '',
  openAIKey: '',

  modelConfig: {
    provider: 'onnx-community',
    model: 'large-v3-turbo',
    useOnnx: true,
    useQuantized: true,
    device: 'webgpu',
    dtype: 'fp32'
  },

  sentimentAnalysis: {
    provider: 'SamLowe',
    model: 'roberta-base-go_emotions',
    thresholds: {
      admiration: 0.25,
      amusement: 0.45,
      anger: 0.15,
      annoyance: 0.10,
      approval: 0.30,
      caring: 0.40,
      confusion: 0.55,
      curiosity: 0.25,
      desire: 0.25,
      disappointment: 0.40,
      disapproval: 0.30,
      disgust: 0.20,
      embarrassment: 0.10,
      excitement: 0.35,
      fear: 0.40,
      gratitude: 0.45,
      grief: 0.05,
      joy: 0.40,
      love: 0.25,
      nervousness: 0.25,
      optimism: 0.20,
      pride: 0.10,
      realization: 0.15,
      relief: 0.05,
      remorse: 0.10,
      sadness: 0.40,
      surprise: 0.15,
      neutral: 0.25
    }
  },

  audioSampleRate: 44100,
  fftSize: 2048,
  minPitchLag: 20,
  maxPitchLag: 1000,
  onsetThreshold: 0.1,
  defaultPitch: 440,
  defaultTempo: 120,
  defaultConfidence: 0.75,
  noSpeechText: "(no speech detected)",
  defaultModel: "large-v3-turbo",
  
  speakerIdTemplate: "speaker-{?}",
  speakerNameTemplate: "Speaker {?}",
  speakerColors: [
    '#4f46e5', '#7c3aed', '#db2777', '#ea580c',
    '#16a34a', '#2563eb', '#9333ea', '#c026d3'
  ],
  maxSpeakers: 8,

  supportedModels: [
    { id: 'large-v3-turbo', name: 'Whisper Large v3 Turbo' },
    { id: 'large-v3', name: 'Whisper Large v3' },
    { id: 'large-v2', name: 'Whisper Large v2' },
    { id: 'large', name: 'Whisper Large' },
    { id: 'medium', name: 'Whisper Medium' },
    { id: 'small', name: 'Whisper Small' },
    { id: 'base', name: 'Whisper Base' },
    { id: 'tiny', name: 'Whisper Tiny' },
    { id: 'distil-small', name: 'Distil Whisper Small' }
  ],

  modelRevision: 'main',
  enableModelCaching: true,
  sentimentModel: 'SamLowe/roberta-base-go_emotions',
  supportedLanguages: [
    { code: 'auto', name: 'Auto Detect' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ],
  defaultLanguage: 'auto',

  waveformColors: {
    background: '#ffffff',
    waveform: '#4a5568',
    progress: '#3182ce',
    cursor: '#718096'
  },
  waveformHeight: 128,

  minVolume: 0,
  maxVolume: 200,
  volumeStep: 1,

  minZoom: 1,
  maxZoom: 1000,
  defaultZoom: 100,
  zoomStep: 10,

  timeFormat: 'HH:mm:ss',
  showMilliseconds: true,

  defaultChunkLength: 30,
  defaultStrideLength: 5,
  defaultFloatingPoint: 32,
  defaultDiarization: true,

  returnTimestamps: true,
  maxNewTokens: 128,
  numBeams: 1,
  temperature: 0,
  noRepeatNgramSize: 3
};

export const getSettings = (): AudioSettings => {
  const savedSettings = localStorage.getItem('audioSettings');
  if (savedSettings) {
    return { ...defaultSettings, ...JSON.parse(savedSettings) };
  }
  return defaultSettings;
};

export const saveSettings = (settings: Partial<AudioSettings>) => {
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...settings };
  localStorage.setItem('audioSettings', JSON.stringify(newSettings));
  return newSettings;
};
