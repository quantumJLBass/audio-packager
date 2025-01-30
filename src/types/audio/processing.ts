/**
 * Audio processing type definitions
 */
import { Transcription } from './transcription';

export interface AudioProcessingState {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  isReady: boolean;
  isTranscribing: boolean;
  transcriptions: Transcription[];
  error: string | null;
}

export interface AudioProcessingOptions {
  chunkLength: number;
  strideLength: number;
  language: string;
  task: "transcribe";
  return_timestamps: boolean;
  max_new_tokens: number;
  num_beams: number;
  temperature: number;
  no_repeat_ngram_size: number;
}

export interface PretrainedModelOptions {
  device: "cpu" | "cuda" | "webgpu" | "wasm" | "auto" | "gpu" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu";
  revision: string;
  cache_dir: string | null | undefined;
  dtype?: "fp32" | "fp16" | "int8";
}

export interface ModelUrlOptions {
  provider: string;
  model: string;
  isQuantized?: boolean;
  isOnnx?: boolean;
  language?: string;
}

export type SupportedAudioType = 
  | 'audio/mpeg' | 'audio/wav' | 'audio/ogg' | 'audio/aac'
  | 'audio/flac' | 'audio/alac' | 'audio/aiff' | 'audio/m4a'
  | 'audio/pcm' | 'audio/dsd' | 'audio/mp4' | 'audio/webm'
  | 'audio/opus' | 'audio/midi' | 'audio/vorbis';