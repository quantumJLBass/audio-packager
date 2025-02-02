import { DeviceType, DType, SupportedAudioType } from './common';
import { Transcription } from './transcription';

export enum ProcessingTask {
  Transcribe = 'transcribe',
  Translate = 'translate'
}

export interface ProcessingState {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  isReady: boolean;
  isTranscribing: boolean;
  transcriptions: Transcription[];
  error: string | null;
}

export interface ProcessingOptions {
  task?: ProcessingTask;
  chunk_length_s?: number;
  stride_length_s?: number;
  return_timestamps?: boolean;
  max_new_tokens?: number;
  num_beams?: number;
  temperature?: number;
  no_repeat_ngram_size?: number;
}

export interface TranscriptionChunkOutput {
  text: string;
  timestamp?: [number, number];
  confidence?: number;
}

export interface TranscriptionOutput {
  text: string;
  chunks?: TranscriptionChunkOutput[];
}

export interface PretrainedModelOptions {
  revision?: string;
  cache_dir?: string | null;
  force_download?: boolean;
  resume_download?: boolean;
  proxies?: any;
  device?: DeviceType;
  dtype?: DType;
  model_id?: string;
  task?: string;
  subtask?: string;
  isQuantized?: boolean;
  local_files_only?: boolean;
}

export interface ModelUrlOptions {
  provider: string;
  model: string;
  isQuantized?: boolean;
  isOnnx?: boolean;
  language?: string;
}