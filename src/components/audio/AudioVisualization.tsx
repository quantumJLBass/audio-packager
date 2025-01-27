import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WaveformVisualizer } from './WaveformVisualizer';
import { AudioSettings } from '@/types/audio/settings';

interface AudioVisualizationProps {
  url: string;
  settings: AudioSettings;
  onTimeUpdate: (time: number) => void;
  onPlayPause: (isPlaying: boolean) => void;
  onReady: () => void;
  onDurationChange: (duration: number) => void;
}

export const AudioVisualization: React.FC<AudioVisualizationProps> = ({
  url,
  settings,
  onTimeUpdate,
  onPlayPause,
  onReady,
  onDurationChange,
}) => {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Audio Visualization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <WaveformVisualizer
          key={url}
          url={url}
          speakers={[]}
          onTimeUpdate={onTimeUpdate}
          onPlayPause={onPlayPause}
          onReady={onReady}
          onDurationChange={onDurationChange}
          settings={settings}
        />
      </CardContent>
    </Card>
  );
};