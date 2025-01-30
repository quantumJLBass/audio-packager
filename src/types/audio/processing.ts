/**
 * Type definitions for audio processing functionality
 */

import { Transcription } from './transcription';

/**
 * Options for pretrained model configuration
 */
export interface PretrainedModelOptions {
  device: "webgpu";
  revision: string;
  cache_dir: string | null | undefined;
  dtype: "fp32";
}

/**
 * Options for audio processing configuration
 */
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

export type DeviceType = "webgpu";
export type DTypeOption = "fp32";

/**
 * Model configuration
 */
export interface ModelConfig {
  provider: string;
  model: string;
  useOnnx: boolean;
  useQuantized: boolean;
  device: DeviceType;
  dtype: DTypeOption;
}