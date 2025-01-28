import React from 'react';
import { AudioVisualization } from '../AudioVisualization';
import { AudioSettings } from '@/types/audio/settings';

interface AudioVisualizerProps {
  url: string;
  settings: AudioSettings;
  onTimeUpdate: (time: number) => void;
  onPlayPause: (isPlaying: boolean) => void;
  onReady: () => void;
  onDurationChange: (duration: number) => void;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  url,
  settings,
  onTimeUpdate,
  onPlayPause,
  onReady,
  onDurationChange
}) => {
  return (
    <AudioVisualization
      url={url}
      settings={settings}
      onTimeUpdate={onTimeUpdate}
      onPlayPause={onPlayPause}
      onReady={onReady}
      onDurationChange={onDurationChange}
    />
  );
};