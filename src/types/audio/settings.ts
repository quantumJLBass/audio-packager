export interface AudioSettings {
  huggingFaceToken: string;
  openAIKey: string;
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
  speakerIdTemplate: string;
  speakerNameTemplate: string;
  speakerColors: string[];
  maxSpeakers: number;
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
  waveformColors: {
    background: string;
    waveform: string;
    progress: string;
    cursor: string;
  };
  minVolume: number;
  maxVolume: number;
  volumeStep: number;
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  zoomStep: number;
  timeFormat: string;
  showMilliseconds: boolean;
  defaultChunkLength: number;
  defaultStrideLength: number;
  defaultFloatingPoint: number;
  minPxPerSec: number;
  defaultDiarization: boolean;
  initialState: {
    currentTime: number;
    isPlaying: boolean;
    duration: number;
    isReady: boolean;
    isTranscribing: boolean;
    transcriptions: any[];
    error: string | null;
  };
}