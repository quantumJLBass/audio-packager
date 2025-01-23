import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, Volume2, VolumeX, ZoomIn, ZoomOut } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WaveformControlsProps {
  isPlaying: boolean;
  isReady: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  zoom: number;
  onPlayPause: () => void;
  onVolumeChange: (value: number[]) => void;
  onMute: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const WaveformControls: React.FC<WaveformControlsProps> = ({
  isPlaying,
  isReady,
  volume,
  currentTime,
  duration,
  zoom,
  onPlayPause,
  onVolumeChange,
  onMute,
  onZoomIn,
  onZoomOut,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayPause}
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

        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomOut}
            className="hover:bg-primary/20"
            disabled={!isReady}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <div className="w-12 text-center">
            <span className="text-sm font-mono">{zoom}%</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomIn}
            className="hover:bg-primary/20"
            disabled={!isReady}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMute}
          className="hover:bg-primary/20"
        >
          {volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        <div className="w-24">
          <Slider
            value={[volume]}
            max={1}
            step={0.1}
            onValueChange={onVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};