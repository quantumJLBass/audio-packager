import { DeviceType, DType } from '@/types/audio/processing';

export interface ModelSettings {
  provider: string;
  model: string;
  useOnnx: boolean;
  useQuantized: boolean;
  device: DeviceType;
  dtype: DType;
}

export interface SupportedModel {
  id: string;
  name: string;
  provider: string;
}