import { AudioMetadata } from './metadata';
import { Transcription } from './transcription';
import { AudioAnalysis } from './analysis';
import { Speaker } from './speaker';
import { AudioProcessingOptions } from './processing';

export interface AudioProject {
  id: string;
  metadata: AudioMetadata;
  transcriptions: Transcription[];
  analysis: AudioAnalysis;
  speakers: Speaker[];
  processingOptions: AudioProcessingOptions;
  status: 'idle' | 'processing' | 'completed' | 'error';
  error?: string;
}