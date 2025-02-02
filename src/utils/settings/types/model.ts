import { DeviceType, DType } from '@/types/audio/common';

export interface ModelSettings {
  provider: string;
  model: string;
  useOnnx: boolean;
  useQuantized: boolean;
  device: DeviceType;
  dtype: DType;
}

export interface SupportedModel {
  id: number;
  key: string;
  name: string;
  provider: string;
}