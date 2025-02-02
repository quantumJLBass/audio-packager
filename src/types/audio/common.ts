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

export type { DeviceType, DType, SupportedAudioType };