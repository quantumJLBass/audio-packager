export interface AudioMetadata {
  title: string;
  description: string;
  tags: string[];
  created: Date;
  modified: Date;
  duration: number;
  format: string;
  sampleRate: number;
  channels: number;
}

export interface Speaker {
  id: string;
  name: string;
  color: string;
}

export interface Transcription {
  text: string;
  start: number;
  end: number;
  speaker?: Speaker;
  sentiment?: string;
  confidence: number;
}

export interface AudioAnalysis {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  tone: {
    pitch: number;
    tempo: number;
    energy: number;
  };
  emotions: {
    label: string;
    score: number;
  }[];
}

export interface ProcessingOptions {
  transcription: boolean;
  diarization: boolean;
  sentiment: boolean;
  toneAnalysis: boolean;
}

export interface AudioProject {
  id: string;
  metadata: AudioMetadata;
  transcriptions: Transcription[];
  analysis: AudioAnalysis;
  speakers: Speaker[];
  processingOptions: ProcessingOptions;
  status: 'idle' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: Speaker;
  sentiment?: string;
  tone?: {
    pitch: number;
    tempo: number;
    energy: number;
  };
}

export interface AudioFile {
  id: string;
  name: string;
  url: string;
  duration: number;
  transcription?: TranscriptionSegment[];
  metadata: AudioMetadata;
}

export interface WaveformVisualizerProps {
  url: string;
  speakers: Speaker[];
  onTimeUpdate: (time: number) => void;
  onSeek?: (time: number) => void;
  onPlayPause?: (isPlaying: boolean) => void;
  onReady?: () => void;
  onDurationChange?: (duration: number) => void;
  settings: AudioSettings;
}

export interface AudioProcessingState {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  isReady: boolean;
  isTranscribing: boolean;
  transcriptions: Transcription[];
  error: string | null;
}

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

export interface PretrainedModelOptions {
  revision?: string;
  cache_dir?: string | null;
  device?: "webgpu" | "auto" | "gpu" | "cpu" | "wasm" | "cuda" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu";
  dtype?: "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16";
}

export interface TranscriptionConfig {
  language?: string | null;
  task?: "transcribe" | "translate";
  chunk_length_s: number;
  stride_length_s: number;
  return_timestamps: boolean;
  max_new_tokens: number;
  num_beams: number;
  temperature: number;
  no_repeat_ngram_size: number;
}
