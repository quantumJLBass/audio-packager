import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, ZoomIn, ZoomOut } from 'lucide-react';

interface WaveformControlsProps {
  isPlaying: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
  zoom: number;
  onPlayPause: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const WaveformControls: React.FC<WaveformControlsProps> = ({
  isPlaying,
  isReady,
  currentTime,
  duration,
  zoom,
  onPlayPause,
  onZoomIn,
  onZoomOut,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPlayPause}
        disabled={!isReady}
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

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          disabled={!isReady || zoom <= 50}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-mono w-16 text-center">{zoom}%</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          disabled={!isReady || zoom >= 500}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};