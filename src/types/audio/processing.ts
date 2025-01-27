export interface ProcessingOptions {
  transcription: boolean;
  diarization: boolean;
  sentiment: boolean;
  toneAnalysis: boolean;
}

export interface AudioProcessingState {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  isReady: boolean;
  isTranscribing: boolean;
  transcriptions: any[];
  error: string | null;
}

export interface PretrainedModelOptions {
  revision?: string;
  cache_dir?: string | null;
  device?: "webgpu" | "auto" | "gpu" | "cpu" | "wasm" | "cuda" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu";
  dtype?: "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16";
}

export interface TranscriptionConfig {
  language?: string | null;
  task?: "transcribe" | "translate";
  chunk_length_s: number;
  stride_length_s: number;
  return_timestamps: boolean;
  max_new_tokens: number;
  num_beams: number;
  temperature: number;
  no_repeat_ngram_size: number;
}