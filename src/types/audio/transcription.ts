import { Speaker } from './speaker';

export interface Transcription {
  text: string;
  start: number;
  end: number;
  speaker?: Speaker;
  sentiment?: string;
  confidence: number;
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