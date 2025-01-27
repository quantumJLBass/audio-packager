import { AudioMetadata } from './metadata';
import { Transcription } from './transcription';
import { AudioAnalysis } from './analysis';
import { Speaker } from './speaker';
import { ProcessingOptions } from './processing';

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