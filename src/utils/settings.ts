export interface AudioSettings {
  // Audio Processing
  audioSampleRate: number;
  fftSize: number;
  minPitchLag: number;
  maxPitchLag: number;
  onsetThreshold: number;
  defaultPitch: number;
  defaultTempo: number;
  
  // Model Settings
  huggingFaceToken: string;
  openAIKey: string;
  modelRevision: string;
  enableModelCaching: boolean;
  sentimentModel: string;
  
  // Visualization
  speakerColors: string[];
  waveformColors: {
    background: string;
    waveform: string;
    progress: string;
    cursor: string;
  };
  
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
  defaultLanguage: string;
  defaultModel: string;
}

const defaultSettings: AudioSettings = {
  audioSampleRate: 44100,
  fftSize: 2048,
  minPitchLag: 20,
  maxPitchLag: 1000,
  onsetThreshold: 0.1,
  defaultPitch: 440,
  defaultTempo: 120,
  
  huggingFaceToken: '',
  openAIKey: '',
  modelRevision: 'main',
  enableModelCaching: true,
  sentimentModel: 'SamLowe/roberta-base-go_emotions',
  
  speakerColors: [
    '#4f46e5', '#7c3aed', '#db2777', '#ea580c',
    '#16a34a', '#2563eb', '#9333ea', '#c026d3'
  ],
  waveformColors: {
    background: '#ffffff',
    waveform: '#4a5568',
    progress: '#3182ce',
    cursor: '#718096'
  },
  
  minZoom: 1,
  maxZoom: 500,
  defaultZoom: 50,
  zoomStep: 10,
  
  timeFormat: 'HH:mm:ss',
  showMilliseconds: true,
  
  defaultChunkLength: 30,
  defaultStrideLength: 5,
  defaultFloatingPoint: 32,
  defaultLanguage: 'auto',
  defaultModel: 'whisper-large-v3'
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