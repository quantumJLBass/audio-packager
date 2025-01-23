import React from 'react';
import { PlaybackControls } from './PlaybackControls';
import { VolumeControls } from './VolumeControls';
import { ZoomControls } from './ZoomControls';

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
  onZoomChange: (value: number) => void;
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
  onZoomChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-4">
        <PlaybackControls
          isPlaying={isPlaying}
          isReady={isReady}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={onPlayPause}
        />
        
        <ZoomControls
          zoom={zoom}
          isReady={isReady}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onZoomChange={onZoomChange}
        />
      </div>

      <VolumeControls
        volume={volume}
        onVolumeChange={onVolumeChange}
        onMute={onMute}
      />
    </div>
  );
};