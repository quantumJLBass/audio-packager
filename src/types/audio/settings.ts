import { Transcription } from './transcription';

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
  modelRevision: string;
  enableModelCaching: boolean;
  defaultLanguage: string;
  
  // Processing Options
  defaultChunkLength: number;
  defaultStrideLength: number;
  defaultFloatingPoint: number;

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