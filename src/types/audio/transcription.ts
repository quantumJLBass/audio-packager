import { Speaker } from './speaker';

export interface Transcription {
  id: string;
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: Speaker;
}

export interface TranscriptionSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  confidence: number;
}

export interface TranscriptionResult {
  text: string;
  segments: TranscriptionSegment[];
  language: string;
}