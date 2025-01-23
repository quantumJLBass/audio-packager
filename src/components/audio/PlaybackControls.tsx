import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  isReady,
  currentTime,
  duration,
  onPlayPause,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPlayPause}
        disabled={!isReady}
        className="hover:bg-primary/20"
      >
        {isPlaying ? (
          <PauseCircle className="h-6 w-6" />
        ) : (
          <PlayCircle className="h-6 w-6" />
        )}
      </Button>
      
      <span className="text-sm font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};