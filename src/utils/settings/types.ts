import { DeviceType, DType } from '@/types/audio/processing';
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
