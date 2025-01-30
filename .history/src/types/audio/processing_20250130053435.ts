import { Transcription } from './transcription';

export enum DeviceType {
  CPU = "cpu",
  CUDA = "cuda",
  WebGPU = "webgpu",
  WASM = "wasm",
  Auto = "auto",
  GPU = "gpu",
  DML = "dml",
  WebNN = "webnn",
  WebNNNPU = "webnn-npu",
  WebNNGPU = "webnn-gpu",
  WebNNCPU = "webnn-cpu"
}

export enum DType {
  FP32 = "fp32",
  FP16 = "fp16",
  INT8 = "int8"
}

export enum ProcessingTask {
  Transcribe = "transcribe",
  Translate = "translate"
}

export interface ModelUrlOptions {
  provider: string;
  model: string;
  isQuantized?: boolean;
  isOnnx?: boolean;
  language?: string;
}

export interface PretrainedModelOptions {
  isQuantized?: boolean;
  isOnnx?: boolean;
  device: DeviceType;
  revision: string;
  cache_dir: string | null | undefined;
  dtype?: DType;
}

export interface AudioProcessingOptions {
  chunkLength: number;
  strideLength: number;
  language: string;
  task: ProcessingTask;
  return_timestamps: boolean;
  max_new_tokens: number;
  num_beams: number;
  temperature: number;
  no_repeat_ngram_size: number;
}

export interface AudioProcessingState {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  isReady: boolean;
  isTranscribing: boolean;
  transcriptions: Transcription[];
  error: string | null;
}

export type SupportedAudioType =
  | 'audio/mpeg'
  | 'audio/wav'
  | 'audio/ogg'
  | 'audio/aac'
  | 'audio/flac'
  | 'audio/alac'
  | 'audio/aiff'
  | 'audio/m4a'
  | 'audio/pcm'
  | 'audio/dsd'
  | 'audio/mp4'
  | 'audio/webm'
  | 'audio/opus'
  | 'audio/midi'
  | 'audio/vorbis';
