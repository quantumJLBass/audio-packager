export interface AudioAnalysis {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  tone: {
    pitch: number;
    tempo: number;
    energy: number;
  };
  emotions: {
    label: string;
    score: number;
  }[];
}