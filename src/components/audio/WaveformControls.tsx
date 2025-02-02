import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  ZoomIn,
  ZoomOut,
  AudioWaveform,
  Layers
} from 'lucide-react';
import { formatTimestamp } from '@/utils/timeFormat';

interface WaveformControlsProps {
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
  onZoomChange: (value: number) => void;
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
  onZoomChange,
  onToggleSpectrogram,
  onToggleRegions,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          disabled={!isReady}
          onClick={onPlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <span className="text-sm font-mono">
          {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSpectrogram}
          className={showSpectrogram ? 'bg-primary/20' : ''}
        >
          <AudioWaveform className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleRegions}
          className={showRegions ? 'bg-primary/20' : ''}
        >
          <Layers className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-mono w-12 text-center">
            {zoom}%
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomIn}
            disabled={zoom >= 500}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};