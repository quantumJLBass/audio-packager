import React, { useEffect, useState, useRef } from 'react';
import { AudioWaveform } from '@/components/AudioWaveform';
import { AudioSettings } from '@/types/audio/settings';
import { useToast } from '@/hooks/use-toast';

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
  const initializingRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    if (url && !initializingRef.current) {
      initializingRef.current = true;
      setIsLoaded(false);
    }
  }, [url]);

  const handleReady = () => {
    if (!isLoaded) {
      setIsLoaded(true);
      initializingRef.current = false;
      onReady();
      toast({
        title: "Waveform Ready",
        description: "Audio visualization has been initialized",
      });
    }
  };

  return (
    <div className="space-y-4">
      {url && (
        <AudioWaveform
          url={url}
          onReady={handleReady}
          onTimeUpdate={onTimeUpdate}
          height={settings.waveformHeight || 128}
          waveColor={settings.waveformColors.waveform}
          progressColor={settings.waveformColors.progress}
        />
      )}
    </div>
  );
};