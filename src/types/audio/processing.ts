/**
 * Audio processing type definitions
 */
import { Transcription } from './transcription';

/**
 * Supported audio MIME types
 */
export type SupportedAudioType = 
  | 'audio/mpeg' | 'audio/wav' | 'audio/ogg' | 'audio/aac'
  | 'audio/flac' | 'audio/alac' | 'audio/aiff' | 'audio/m4a'
  | 'audio/pcm' | 'audio/dsd' | 'audio/mp4' | 'audio/webm'
  | 'audio/opus' | 'audio/midi' | 'audio/vorbis';

/**
 * Supported device types for model processing
 */
export enum DeviceType {
  CPU = 'cpu',
  CUDA = 'cuda',
  WebGPU = 'webgpu',
  WebGL = 'webgl',
  WASM = 'wasm'
}

/**
 * Supported data types for model processing
 */
export enum DType {
  FP32 = 'float32',
  FP16 = 'float16',
  INT8 = 'int8'
}

/**
 * Processing task types
 */
export enum ProcessingTask {
  Transcribe = 'transcribe',
  Translate = 'translate'
}

/**
 * Audio processing configuration
 */
export interface ProcessingConfig {
  task: ProcessingTask;
  language?: string;
  model: string;
  device: DeviceType;
  dtype: DType;
  chunkLength: number;
  strideLength: number;
  returnTimestamps: boolean;
  maxNewTokens: number;
  numBeams: number;
  temperature: number;
  noRepeatNgramSize: number;
}

/**
 * Audio processing result
 */
export interface ProcessingResult {
  id: string;
  text: string;
  segments: Transcription[];
  language: string;
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