export enum DeviceType {
  CPU = 'cpu',
  WebGPU = 'webgpu',
  WebGL = 'webgl',
  WASM = 'wasm'
}

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