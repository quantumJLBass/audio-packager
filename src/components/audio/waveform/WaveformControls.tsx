import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, Volume2, VolumeX, ZoomIn, ZoomOut, AudioWaveform, Layers } from 'lucide-react';
import { formatTimestamp } from '@/utils/timeFormat';

export interface WaveformControlsProps {
  isPlaying: boolean;
  isReady: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  zoom: number;
  showSpectrogram: boolean;
  showRegions: boolean;
  onPlayPause: () => void;
  onVolumeChange: (value: number[]) => void;
  onMute: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange: (newZoom: number) => void;
  onToggleSpectrogram: () => void;
  onToggleRegions: () => void;
}

export const WaveformControls: React.FC<WaveformControlsProps> = ({
  isPlaying,
  isReady,
  volume,
  currentTime,
  duration,
  zoom,
  showSpectrogram,
  showRegions,
  onPlayPause,
  onVolumeChange,
  onMute,
  onZoomIn,
  onZoomOut,
  onToggleSpectrogram,
  onToggleRegions,
}) => {
  return (
    <div className="flex items-center space-x-4 p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg">
      <Button
        variant="ghost"
        size="icon"
        disabled={!isReady}
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <PauseCircle className="h-6 w-6" />
        ) : (
          <PlayCircle className="h-6 w-6" />
        )}
      </Button>

      <div className="flex items-center space-x-2 min-w-[100px]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMute}
        >
          {volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          value={[volume]}
          max={1}
          step={0.1}
          onValueChange={onVolumeChange}
          className="w-24"
        />
      </div>

      <div className="flex-1 text-center text-sm">
        {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant={showSpectrogram ? "default" : "ghost"}
        size="icon"
        onClick={onToggleSpectrogram}
      >
        <AudioWaveform className="h-4 w-4" />
      </Button>

      <Button
        variant={showRegions ? "default" : "ghost"}
        size="icon"
        onClick={onToggleRegions}
      >
        <Layers className="h-4 w-4" />
      </Button>
    </div>
  );
};