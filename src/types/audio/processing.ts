import { Transcription } from './transcription';

export interface PretrainedModelOptions {
  device: "webgpu"; // Must be webgpu only as per current implementation
  revision: string;
  cache_dir: string | null | undefined;
  dtype: "fp32"; // Must be fp32 only as per current implementation
}

export interface AudioProcessingOptions {
  chunkLength: number;
  strideLength: number;
  language: string;
  task: "transcribe"; // Currently only supports transcribe
  return_timestamps: boolean;
  max_new_tokens: number;
  num_beams: number;
  temperature: number;
  no_repeat_ngram_size: number;
}

export interface ProcessingResult {
  text: string;
  start: number;
  end: number;
  confidence: number;
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

// Device options for future implementation
export type DeviceType = "webgpu";  // Restricted to webgpu only for now
export type DTypeOption = "fp32";   // Restricted to fp32 only for now

export interface ModelConfig {
  provider: string;
  model: string;
  useOnnx: boolean;
  useQuantized: boolean;
  device: DeviceType;
  dtype: DTypeOption;
}