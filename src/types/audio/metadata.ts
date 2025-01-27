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

export interface AudioFile {
  id: string;
  name: string;
  url: string;
  duration: number;
  transcription?: TranscriptionSegment[];
  metadata: AudioMetadata;
}