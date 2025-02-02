import { DeviceType, DType } from './common';
import { Transcription } from './transcription';

export type HFDevice = "cpu" | "webgpu" | "wasm" | "auto" | "gpu" | "cuda" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu";
export type HFDType = "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16";

export type SupportedAudioType =
  | 'audio/wav'
  | 'audio/wave'
  | 'audio/x-wav'
  | 'audio/mp3'
  | 'audio/mpeg'
  | 'audio/mp4'
  | 'audio/aac'
  | 'audio/ogg'
  | 'audio/webm'
  | 'audio/opus'
  | 'audio/midi'
  | 'audio/vorbis';

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
  device?: HFDevice;
  dtype?: HFDType;
  model_id?: string;
  task?: string;
  subtask?: string;
  local_files_only?: boolean;
}