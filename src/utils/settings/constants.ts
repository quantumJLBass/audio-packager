import { DeviceTypes, DTypes } from '@/types/audio/common';
import type { AutoSaveSettings, InitialState, Language, ModelSettings, SupportedModel, WaveformColors } from './types';

export const AUTO_SAVE_DEFAULTS: AutoSaveSettings = {
  shortTermDelay: 3000,
  longTermDelay: 30000,
  enabled: true
};

export const MODEL_DEFAULTS: ModelSettings = {
  provider: 'onnx-community',
  model: 'whisper-large-v3-turbo_timestamped',
  useOnnx: true,
  useQuantized: false,
  device: DeviceTypes.WebGPU,
  dtype: DTypes.FP32
};

export const SUPPORTED_MODELS: SupportedModel[] = [
  { id: 1, key: 'whisper-tiny', name: 'Whisper Tiny', provider: "openai" },
  { id: 2, key: 'whisper-base', name: 'Whisper Base', provider: "openai" },
  { id: 3, key: 'whisper-small', name: 'Whisper Small', provider: "openai" },
  { id: 4, key: 'whisper-medium', name: 'Whisper Medium', provider: "openai" },
  { id: 5, key: 'whisper-large', name: 'Whisper Large', provider: "openai" },
  { id: 6, key: 'whisper-large-v2', name: 'Whisper Large v2', provider: "openai" },
  { id: 7, key: 'whisper-large-v3', name: 'Whisper Large v3', provider: "openai" },
  { id: 8, key: 'whisper-large-v3-turbo', name: 'Whisper Large v3 Turbo', provider: "openai" },
  { id: 9, key: 'whisper-large-v3-turbo-ONNX', name: 'Whisper Large v3 Turbo ONNX', provider: "onnx-community" },
  { id: 10, key: 'whisper-large-v3-turbo_timestamped', name: 'Whisper Large v3 Turbo timestamped ONNX', provider: "onnx-community" },
  { id: 11, key: 'whisper-small.en_timestamped', name: 'Whisper Small English timestamped ONNX', provider: "onnx-community" },
  { id: 12, key: 'whisper-small_timestamped', name: 'Whisper Small timestamped ONNX', provider: "onnx-community" },
  { id: 13, key: 'whisper-base.en_timestamped', name: 'Whisper Base English timestamped ONNX', provider: "onnx-community" },
  { id: 14, key: 'whisper-tiny_timestamped', name: 'Whisper Tiny timestamped ONNX', provider: "onnx-community" },
  { id: 15, key: 'whisper-tiny.en_timestamped', name: 'Whisper Tiny English timestamped ONNX', provider: "onnx-community" },
  { id: 16, key: 'whisper-base_timestamped', name: 'Whisper Base timestamped ONNX', provider: "onnx-community" },
  { id: 17, key: 'whisper-base', name: 'Whisper Base ONNX', provider: "onnx-community" },
  { id: 18, key: 'whisper-large-v3-turbo', name: 'Whisper Large v3 Turbo ONNX', provider: "onnx-community" },
  { id: 19, key: 'whisper-base.en', name: 'Whisper Base English ONNX', provider: "onnx-community" },
  { id: 20, key: 'whisper-small.en', name: 'Whisper Small English ONNX', provider: "onnx-community" },
  { id: 21, key: 'whisper-small', name: 'Whisper Small ONNX', provider: "onnx-community" },
  { id: 22, key: 'whisper-tiny.en', name: 'Whisper Tiny English ONNX', provider: "onnx-community" },
  { id: 23, key: 'whisper-tiny', name: 'Whisper Tiny ONNX', provider: "onnx-community" },
  { id: 24, key: 'moonshine-tiny-ONNX', name: 'Whisper Large v3 Turbo ONNX timestamped', provider: "onnx-community" }
];

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

export const WAVEFORM_DEFAULTS: WaveformColors = {
  background: '#ffffff',
  waveform: '#4a5568',
  progress: '#3182ce',
  cursor: '#718096'
};

export const INITIAL_STATE: InitialState = {
  currentTime: 0,
  isPlaying: false,
  duration: 0,
  isReady: false,
  isTranscribing: false,
  transcriptions: [],
  error: null
};
