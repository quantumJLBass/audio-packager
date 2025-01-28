import { Pipeline } from '@huggingface/transformers';

export interface PretrainedModelOptions {
  device: "webgpu";
  revision: string;
  cache_dir: string | null | undefined;
  dtype?: "fp32";
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