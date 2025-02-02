export type DeviceType = 
  | "auto" 
  | "gpu" 
  | "cpu" 
  | "wasm" 
  | "webgpu" 
  | "cuda" 
  | "dml" 
  | "webnn" 
  | "webnn-npu" 
  | "webnn-gpu" 
  | "webnn-cpu";

export enum DType {
  FP32 = 'float32',
  FP16 = 'float16',
  INT8 = 'int8'
}

export type SupportedAudioType =
  | 'audio/wav'
  | 'audio/wave'
  | 'audio/x-wav'
  | 'audio/mp3'
  | 'audio/mpeg'
  | 'audio/mp4'
  | 'audio/aac'
  | 'audio/ogg'
  | 'audio/webm'
  | 'audio/opus'
  | 'audio/midi'
  | 'audio/vorbis';