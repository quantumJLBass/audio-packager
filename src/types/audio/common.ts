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

export type DType = 
  | "auto"
  | "int8"
  | "fp32"
  | "fp16"
  | "q8"
  | "uint8"
  | "q4"
  | "bnb4"
  | "q4f16";

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

// Create a const object for DeviceType values to use in code
export const DeviceTypes: Record<string, DeviceType> = {
  Auto: "auto",
  GPU: "gpu",
  CPU: "cpu",
  WASM: "wasm",
  WebGPU: "webgpu",
  CUDA: "cuda",
  DML: "dml",
  WebNN: "webnn",
  WebNNNPU: "webnn-npu",
  WebNNGPU: "webnn-gpu",
  WebNNCPU: "webnn-cpu"
} as const;

// Create a const object for DType values to use in code
export const DTypes: Record<string, DType> = {
  Auto: "auto",
  Int8: "int8",
  FP32: "fp32",
  FP16: "fp16",
  Q8: "q8",
  UInt8: "uint8",
  Q4: "q4",
  BNB4: "bnb4",
  Q4F16: "q4f16"
} as const;