/**
 * Audio processing type definitions
 */
import { Transcription } from './transcription';

/**
 * Supported device types for model processing
 */
export enum DeviceType {
  WebGPU = "webgpu",
  CPU = "cpu",
  WASM = "wasm"
}

/**
 * Supported floating point precision types
 */
export enum DType {
  FP32 = "fp32",
  FP16 = "fp16"
}

/**
 * Supported audio processing tasks
 */
export enum ProcessingTask {
  Transcribe = "transcribe",
  Translate = "translate"
}

/**
 * Options for pretrained model configuration
 */
export interface PretrainedModelOptions {
  device: DeviceType;
  revision: string;
  cache_dir: string | null | undefined;
  dtype: DType;
}

/**
 * Options for audio processing configuration
 */
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

/**
 * Result of audio processing
 */
export interface ProcessingResult {
  text: string;
  start: number;
  end: number;
  confidence: number;
}

/**
 * State of audio processing
 */
export interface AudioProcessingState {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  isReady: boolean;
  isTranscribing: boolean;
  transcriptions: Transcription[];
  error: string | null;
}

/**
 * Configuration for model URL construction
 */
export interface ModelUrlOptions {
  provider: string;
  model: string;
  isQuantized?: boolean;
  isOnnx?: boolean;
  language?: string;
}

/**
 * Model configuration
 */
export interface ModelConfig {
  provider: string;
  model: string;
  useOnnx: boolean;
  useQuantized: boolean;
  device: DeviceType;
  dtype: DType;
}