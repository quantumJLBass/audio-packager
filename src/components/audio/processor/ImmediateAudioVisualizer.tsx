import React, { useEffect, useRef } from 'react';
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
  const { toast } = useToast();
  const audioUrlRef = useRef(url);

  useEffect(() => {
    if (url !== audioUrlRef.current) {
      audioUrlRef.current = url;
      console.log('Audio URL updated:', url);
    }
  }, [url]);

  const handleError = (error: Error) => {
    console.error('Audio visualization error:', error);
    toast({
      title: "Error",
      description: "Failed to load audio visualization",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <AudioWaveform
        url={url}
        onReady={onReady}
        onTimeUpdate={onTimeUpdate}
        height={settings.waveformHeight}
        waveColor={settings.waveformColors.waveform}
        progressColor={settings.waveformColors.progress}
        onError={handleError}
      />
    </div>
  );
};