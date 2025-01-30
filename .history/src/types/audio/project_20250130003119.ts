import { AudioAnalysis } from './analysis';
import { AudioMetadata } from './metadata';
import { AudioProcessingOptions } from './processing';
import { Speaker } from './speaker';
import { Transcription } from './transcription';

export interface AudioProject {
  id: string;
  metadata: AudioMetadata;
  transcriptions: Transcription[];
  analysis: AudioAnalysis;
  speakers: Speaker[];
  processingOptions: AudioProcessingOptions;
  status: 'idle' | 'processing' | 'completed' | 'error'; // TODO: setting is it not? but is this really correct given this is a types file?
  error?: string;
}
