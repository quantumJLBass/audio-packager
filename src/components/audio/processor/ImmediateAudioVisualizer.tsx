import React, { useEffect, useState } from 'react';
import { AudioWaveform } from '@/components/AudioWaveform';
import { AudioSettings } from '@/types/audio/settings';
import { useToast } from '@/hooks/use-toast';
import { DebugLogger } from '@/utils/debug';

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
  const { toast } = useToast();

  useEffect(() => {
    if (url && !isLoaded) {
      DebugLogger.log('ImmediateAudioVisualizer', 'Loading audio URL:', url);
      setIsLoaded(false);
    }
  }, [url, isLoaded]);

  const handleReady = () => {
    if (!isLoaded) {
      setIsLoaded(true);
      onReady();
      DebugLogger.log('ImmediateAudioVisualizer', 'Audio visualization ready');
    }
  };

  return (
    <div className="space-y-4">
      {url && (
        <AudioWaveform
          key={url}
          url={url}
          onReady={handleReady}
          onTimeUpdate={onTimeUpdate}
          onPlayPause={onPlayPause}
          onDurationChange={onDurationChange}
          height={settings.waveformHeight}
          waveColor={settings.waveformColors.waveform}
          progressColor={settings.waveformColors.progress}
        />
      )}
    </div>
  );
};