export interface ToneConfig {
  defaultTone: string;
  toneThresholds: {
    [tone: string]: number;
  };
}