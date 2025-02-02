export interface SentimentMetrics {
  value: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface SentimentConfig {
  provider: string;
  model: string;
  defaultLabel: string;
  thresholds: {
    [emotion: string]: SentimentMetrics;
  };
}