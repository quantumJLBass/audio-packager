// Define the device type
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

// Define the data type
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
export const DeviceTypes = {
  Auto: "auto" as DeviceType,
  GPU: "gpu" as DeviceType,
  CPU: "cpu" as DeviceType,
  WASM: "wasm" as DeviceType,
  WebGPU: "webgpu" as DeviceType,
  CUDA: "cuda" as DeviceType,
  DML: "dml" as DeviceType,
  WebNN: "webnn" as DeviceType,
  WebNNNPU: "webnn-npu" as DeviceType,
  WebNNGPU: "webnn-gpu" as DeviceType,
  WebNNCPU: "webnn-cpu" as DeviceType
};

// Create a const object for DType values to use in code
export const DTypes = {
  Auto: "auto" as DType,
  Int8: "int8" as DType,
  FP32: "fp32" as DType,
  FP16: "fp16" as DType,
  Q8: "q8" as DType,
  UInt8: "uint8" as DType,
  Q4: "q4" as DType,
  BNB4: "bnb4" as DType,
  Q4F16: "q4f16" as DType
};