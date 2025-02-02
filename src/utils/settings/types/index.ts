export * from './model';
export * from './sentiment';
export * from './tone';
export * from './visualization';

export interface AutoSaveSettings {
  shortTermDelay: number;
  longTermDelay: number;
  enabled: boolean;
}

export interface InitialState {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  isReady: boolean;
  isTranscribing: boolean;
  transcriptions: any[];
  error: string | null;
}