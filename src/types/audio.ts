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
}

export interface AudioProcessingState {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  isReady: boolean;
  isTranscribing: boolean;
  transcriptions: Transcription[];
}

export interface AudioProcessingOptions {
  model: string;
  language: string;
  floatingPoint: number;
  diarization: boolean;
  chunkLength: number;
  strideLength: number;
  huggingFaceToken?: string;
}
