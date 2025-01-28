import React, { useEffect, useState } from 'react';
import { AudioWaveform } from '@/components/AudioWaveform';
import { AudioSettings } from '@/types/audio/settings';

interface ImmediateAudioVisualizerProps {
  url: string;
  settings: AudioSettings;
  onTimeUpdate: (time: number) => void;
  onPlayPause: (isPlaying: boolean) => void;
  onReady: () => void;
  onDurationChange: (duration: number) => void;
}

export const ImmediateAudioVisualizer: React.FC<ImmediateAudioVisualizerProps> = ({
  url,
  settings,
  onTimeUpdate,
  onPlayPause,
  onReady,
  onDurationChange,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (url) {
      setIsLoaded(true);
    }
  }, [url]);

  return (
    <div className="space-y-4">
      <AudioWaveform
        url={url}
        onReady={() => {
          onReady();
          setIsLoaded(true);
        }}
        onTimeUpdate={onTimeUpdate}
        height={settings.waveformHeight || 128}
        waveColor={settings.waveformColors.waveform}
        progressColor={settings.waveformColors.progress}
      />
    </div>
  );
};