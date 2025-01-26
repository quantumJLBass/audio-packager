import React, { useState, useEffect, useCallback } from 'react';
import { WaveformCore } from './waveform/WaveformCore';
import { WaveformControls } from './waveform/WaveformControls';
import { WaveformVisualizerProps } from '@/types/audio';
import { useToast } from '@/hooks/use-toast';

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  url,
  speakers,
  onTimeUpdate,
  onSeek,
  onPlayPause,
  onReady,
  onDurationChange,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(100);
  const { toast } = useToast();

  const handleReady = useCallback(() => {
    setIsReady(true);
    onReady?.();
  }, [onReady]);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    onTimeUpdate(time);
  }, [onTimeUpdate]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    onPlayPause?.(!isPlaying);
  }, [isPlaying, onPlayPause]);

  const handleZoomChange = useCallback((newZoom: number) => {
    if (!isReady) {
      toast({
        title: "Error",
        description: "Please wait for audio to load before zooming",
        variant: "destructive",
      });
      return;
    }
    setZoom(newZoom);
  }, [isReady, toast]);

  useEffect(() => {
    if (duration > 0) {
      onDurationChange?.(duration);
    }
  }, [duration, onDurationChange]);

  return (
    <div className="space-y-4">
      <WaveformCore
        url={url}
        onReady={handleReady}
        onTimeUpdate={handleTimeUpdate}
        minPxPerSec={zoom}
      />
      
      <WaveformControls
        isPlaying={isPlaying}
        isReady={isReady}
        currentTime={currentTime}
        duration={duration}
        zoom={zoom}
        onPlayPause={handlePlayPause}
        onZoomIn={() => handleZoomChange(Math.min(500, zoom + 50))}
        onZoomOut={() => handleZoomChange(Math.max(50, zoom - 50))}
      />
    </div>
  );
};