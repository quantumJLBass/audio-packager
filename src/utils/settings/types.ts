import { DeviceType, DType } from '@/types/audio/common';
import { ProcessingTask } from '@/types/audio/processing';
import { Transcription } from '@/types/audio/transcription';

export interface AutoSaveSettings {
  shortTermDelay: number;
  longTermDelay: number;
  enabled: boolean;
}

export interface ModelSettings {
  provider: string;
  model: string;
  useOnnx: boolean;
  useQuantized: boolean;
  device: DeviceType;
  dtype: DType;
}

export interface SupportedModel {
  id: number;
  key: string;
  name: string;
  provider: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface WaveformColors {
  background: string;
  waveform: string;
  progress: string;
  cursor: string;
}

export interface InitialState {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  isReady: boolean;
  isTranscribing: boolean;
  transcriptions: Transcription[];
  error: string | null;
}

export interface AudioSettings {
  debugMode: boolean;
  huggingFaceToken: string;
  openAIKey: string;
  modelConfig: ModelSettings;
  speakerIdTemplate: string;
  speakerNameTemplate: string;
  speakerColors: string[];
  maxSpeakers: number;
  sentimentAnalysis: {
    provider: string;
    model: string;
    defaultLabel: string;
    thresholds: Record<string, { value: number; precision: number; recall: number; f1: number; }>;
  };
  toneAnalysis: {
    defaultTone: string;
    toneThresholds: Record<string, number>;
  };
  audioSampleRate: number;
  fftSize: number;
  minPitchLag: number;
  maxPitchLag: number;
  onsetThreshold: number;
  defaultPitch: number;
  defaultTempo: number;
  defaultConfidence: number;
  noSpeechText: string;
  defaultModel: number;
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
  supportedModels: SupportedModel[];
  modelRevision: string;
  enableModelCaching: boolean;
  sentimentModel: string;
  supportedLanguages: Language[];
  defaultLanguage: string;
  waveformColors: WaveformColors;
  waveformHeight: number;
  minPxPerSec: number;
  minVolume: number;
  maxVolume: number;
  volumeStep: number;
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  zoomStep: number;
  timeFormat: string;
  showMilliseconds: boolean;
  initialState: InitialState;
  autoSave: AutoSaveSettings;
}