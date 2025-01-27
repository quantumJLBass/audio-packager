import { Speaker } from './speaker';
import { AudioSettings } from './settings';

export interface WaveformVisualizerProps {
  url: string;
  speakers: Speaker[];
  onTimeUpdate: (time: number) => void;
  onSeek?: (time: number) => void;
  onPlayPause?: (isPlaying: boolean) => void;
  onReady?: () => void;
  onDurationChange?: (duration: number) => void;
  settings: AudioSettings;
}