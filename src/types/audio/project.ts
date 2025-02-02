import { AudioAnalysis } from './analysis';
import { AudioMetadata } from './metadata';
import { ProcessingOptions } from './processing';
import { Speaker } from './speaker';
import { Transcription } from './transcription';

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