import { DeviceType, DType } from './common';
import { Transcription } from './transcription';

export type SupportedAudioType = 'audio/mpeg' | 'audio/wav' | 'audio/ogg';

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

export interface ModelUrlOptions {
  provider: string;
  model: string;
  language?: string;
}

export interface PretrainedModelOptions {
  revision?: string;
  cache_dir?: string | null;
  force_download?: boolean;
  resume_download?: boolean;
  proxies?: any;
  device?: "cpu" | "webgpu" | "wasm" | "auto" | "gpu" | "cuda" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu";
  dtype?: string;
  model_id?: string;
  task?: string;
  subtask?: string;
  local_files_only?: boolean;
}