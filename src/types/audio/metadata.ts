import { TranscriptionSegment } from './transcription';

export interface AudioMetadata {
  filename: string;
  duration: number;
  sampleRate: number;
  channels: number;
  format: string;
  bitrate: number;
  segments: TranscriptionSegment[];
  language: string;
}

export interface AudioFile {
  id: string;
  name: string;
  size: number;
  type: string;
  metadata: AudioMetadata;
}