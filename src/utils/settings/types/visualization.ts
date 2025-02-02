export interface WaveformColors {
  background: string;
  waveform: string;
  progress: string;
  cursor: string;
}

export interface VisualizationSettings {
  waveformColors: WaveformColors;
  waveformHeight: number;
  minPxPerSec: number;
}