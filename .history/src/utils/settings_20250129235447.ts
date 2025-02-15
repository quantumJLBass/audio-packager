import { Transcription } from '@/types/audio/transcription';

export interface AudioSettings {
  // API Keys
  huggingFaceToken: string;
  openAIKey: string;

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
  huggingFaceToken: '',
  openAIKey: '',

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

  speakerIdTemplate: "speaker-{idx}",
  speakerNameTemplate: "Speaker {idx}",
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

  minPxPerSec: 100,
  initialState: {
    currentTime: 0,
    isPlaying: false,
    duration: 0,
    isReady: false,
    isTranscribing: false,
    transcriptions: [],
    error: null
  }
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
