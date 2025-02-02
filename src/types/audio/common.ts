export enum DeviceType {
  CPU = 'cpu',
  WebGPU = 'webgpu',
  WASM = 'wasm',
  Auto = 'auto',
  GPU = 'gpu',
  CUDA = 'cuda',
  DML = 'dml',
  WebNN = 'webnn',
  WebNNNPU = 'webnn-npu',
  WebNNGPU = 'webnn-gpu',
  WebNNCPU = 'webnn-cpu'
}

export enum DType {
  Int8 = 'int8',
  Auto = 'auto',
  FP32 = 'fp32',
  FP16 = 'fp16',
  Q8 = 'q8',
  UInt8 = 'uint8',
  Q4 = 'q4',
  BNB4 = 'bnb4',
  Q4F16 = 'q4f16'
}

export type SupportedAudioType = 'audio/mpeg' | 'audio/wav' | 'audio/ogg';