import React, { useState, useEffect } from 'react';
import { WaveformCore } from './waveform/WaveformCore';
import { WaveformControls } from './waveform/WaveformControls';
import { Speaker } from '@/types/audio';

interface WaveformVisualizerProps {
  url: string;
  speakers: Speaker[];
  onTimeUpdate?: (time: number) => void;
  onReady?: () => void;
  onDurationChange?: (duration: number) => void;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  url,
  speakers,
  onTimeUpdate,
  onReady,
  onDurationChange,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(100);

  const handleReady = () => {
    setIsReady(true);
    onReady?.();
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    onTimeUpdate?.(time);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(500, zoom + 50));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(50, zoom - 50));
  };

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
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
};