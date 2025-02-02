import React from 'react';
import { AudioSettings } from '@/types/audio/settings';
import { ImmediateAudioVisualizer } from './processor/ImmediateAudioVisualizer';
import { useToast } from '@/hooks/use-toast';

interface AudioProcessorProps {
  audioUrl: string;
  file: File;
  settings: AudioSettings;
}

export const AudioProcessor: React.FC<AudioProcessorProps> = ({
  audioUrl,
  file,
  settings,
}) => {
  const { toast } = useToast();

  const handleTimeUpdate = (time: number) => {
    console.log('Time updated:', time);
  };

  const handlePlayPause = (isPlaying: boolean) => {
    console.log('Play state changed:', isPlaying);
  };

  const handleReady = () => {
    console.log('Audio ready');
    toast({
      title: "Audio Ready",
      description: "Audio player initialized successfully",
    });
  };

  const handleDurationChange = (duration: number) => {
    console.log('Duration:', duration);
  };

  return (
    <div className="space-y-4">
      <ImmediateAudioVisualizer
        url={audioUrl}
        settings={settings}
        onTimeUpdate={handleTimeUpdate}
        onPlayPause={handlePlayPause}
        onReady={handleReady}
        onDurationChange={handleDurationChange}
      />
    </div>
  );
};