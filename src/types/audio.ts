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