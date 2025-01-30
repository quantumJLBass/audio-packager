import { Transcription } from './transcription';

export interface PretrainedModelOptions {
  device: "webgpu"; // TODO: setting is it not? but is this really correct given this is a types file?
  revision: string;
  cache_dir: string | null | undefined;
  dtype?: "fp32"; // TODO: setting is it not? but is this really correct given this is a types file?
}

export interface AudioProcessingOptions {
  chunkLength: number;
  strideLength: number;
  language: string;
  task: "transcribe";// TODO: setting is it not?  but is this really correct given this is a types file?
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
