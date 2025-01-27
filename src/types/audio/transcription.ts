import { Speaker } from './speaker';

export interface Transcription {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: Speaker;
  confidence: number;
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