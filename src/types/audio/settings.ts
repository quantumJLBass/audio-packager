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
  modelRevision: string;
  enableModelCaching: boolean;
  defaultLanguage: string;
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