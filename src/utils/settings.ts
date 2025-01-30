/**
 * Settings management utilities for audio processing configuration
 */
import type { AudioSettings } from '@/types/audio/settings';
import { DeviceType, DType, ProcessingTask } from '@/types/audio/processing';

const defaultSettings: AudioSettings = {
  debugMode: false,
  huggingFaceToken: '',
  openAIKey: '',
  
  modelConfig: {
    provider: 'onnx-community',
    model: 'large-v3-turbo',
    useOnnx: true,
    useQuantized: true,
    device: DeviceType.WebGPU,
    dtype: DType.FP32
  },

  sentimentAnalysis: {
    provider: 'SamLowe',
    model: 'roberta-base-go_emotions',
    defaultLabel: 'neutral',
    thresholds: {
      admiration: { value: 0.25, precision: 0.725, recall: 0.675, f1: 0.699 },
      amusement: { value: 0.45, precision: 0.790, recall: 0.871, f1: 0.829 },
      anger: { value: 0.15, precision: 0.652, recall: 0.379, f1: 0.479 },
      annoyance: { value: 0.10, precision: 0.472, recall: 0.159, f1: 0.238 },
      approval: { value: 0.30, precision: 0.609, recall: 0.302, f1: 0.404 },
      caring: { value: 0.40, precision: 0.448, recall: 0.319, f1: 0.372 },
      confusion: { value: 0.55, precision: 0.500, recall: 0.431, f1: 0.463 },
      curiosity: { value: 0.25, precision: 0.537, recall: 0.356, f1: 0.428 },
      desire: { value: 0.25, precision: 0.630, recall: 0.410, f1: 0.496 },
      disappointment: { value: 0.40, precision: 0.625, recall: 0.199, f1: 0.302 },
      disapproval: { value: 0.30, precision: 0.494, recall: 0.307, f1: 0.379 },
      disgust: { value: 0.20, precision: 0.707, recall: 0.333, f1: 0.453 },
      embarrassment: { value: 0.10, precision: 0.750, recall: 0.243, f1: 0.367 },
      excitement: { value: 0.35, precision: 0.603, recall: 0.340, f1: 0.435 },
      fear: { value: 0.40, precision: 0.758, recall: 0.603, f1: 0.671 },
      gratitude: { value: 0.45, precision: 0.960, recall: 0.881, f1: 0.919 },
      grief: { value: 0.05, precision: 0.333, recall: 0.333, f1: 0.333 },
      joy: { value: 0.40, precision: 0.647, recall: 0.559, f1: 0.600 },
      love: { value: 0.25, precision: 0.773, recall: 0.832, f1: 0.802 },
      nervousness: { value: 0.25, precision: 0.600, recall: 0.130, f1: 0.214 },
      optimism: { value: 0.20, precision: 0.667, recall: 0.376, f1: 0.481 },
      pride: { value: 0.10, precision: 0.875, recall: 0.438, f1: 0.583 },
      realization: { value: 0.15, precision: 0.541, recall: 0.138, f1: 0.220 },
      relief: { value: 0.05, precision: 0.152, recall: 0.636, f1: 0.246 },
      remorse: { value: 0.10, precision: 0.553, recall: 0.750, f1: 0.636 },
      sadness: { value: 0.40, precision: 0.621, recall: 0.494, f1: 0.550 },
      surprise: { value: 0.15, precision: 0.750, recall: 0.404, f1: 0.525 },
      neutral: { value: 0.25, precision: 0.694, recall: 0.604, f1: 0.646 }
    }
  },

  toneAnalysis: {
    defaultTone: 'neutral',
    toneThresholds: {
      whisper: 0.2,
      normal: 0.4,
      loud: 0.6,
      shouting: 0.8
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
  
  processingTask: ProcessingTask.Transcribe,
  defaultChunkLength: 30,
  defaultStrideLength: 5,
  defaultFloatingPoint: 32,
  defaultDiarization: true,
  returnTimestamps: true,
  maxNewTokens: 128,
  numBeams: 1,
  temperature: 0,
  noRepeatNgramSize: 3,

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
  minPxPerSec: 100,

  minVolume: 0,
  maxVolume: 200,
  volumeStep: 1,

  minZoom: 1,
  maxZoom: 1000,
  defaultZoom: 100,
  zoomStep: 10,

  timeFormat: 'HH:mm:ss',
  showMilliseconds: true,

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

/**
 * Retrieves the current audio settings
 */
export { type AudioSettings };
export const getSettings = (): AudioSettings => {
  const savedSettings = localStorage.getItem('audioSettings');
  if (savedSettings) {
    return { ...defaultSettings, ...JSON.parse(savedSettings) };
  }
  return defaultSettings;
};

/**
 * Saves updated audio settings
 */
export const saveSettings = (settings: Partial<AudioSettings>): AudioSettings => {
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...settings };
  localStorage.setItem('audioSettings', JSON.stringify(newSettings));
  return newSettings;
};
