import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useToast } from '@/hooks/use-toast';
import { WaveformControls } from './audio/WaveformControls';

interface AudioWaveformProps {
  url: string;
  onReady?: () => void;
  onTimeUpdate?: (time: number) => void;
  onSeek?: (time: number) => void;
  height?: number;
  waveColor?: string;
  progressColor?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  url,
  onReady,
  onTimeUpdate,
  onSeek,
  height = 128,
  waveColor = '#4a5568',
  progressColor = '#3182ce'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(50);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      wavesurfer.current = WaveSurfer.create({
        container: containerRef.current,
        height,
        waveColor,
        progressColor,
        cursorWidth: 1,
        cursorColor: '#718096',
        normalize: true,
        minPxPerSec: zoom,
        fillParent: true,
        interact: true,
        autoScroll: true,
      });

      wavesurfer.current.load(url);

      wavesurfer.current.on('ready', () => {
        console.log('WaveSurfer ready');
        setDuration(wavesurfer.current?.getDuration() || 0);
        setIsReady(true);
        onReady?.();
      });

      wavesurfer.current.on('error', (err) => {
        console.error('WaveSurfer error:', err);
        toast({
          title: "Error",
          description: "Failed to load audio file. Please try again.",
          variant: "destructive",
        });
      });

      wavesurfer.current.on('audioprocess', (time) => {
        setCurrentTime(time);
        onTimeUpdate?.(time);
      });

      wavesurfer.current.on('interaction', () => {
        const time = wavesurfer.current?.getCurrentTime() || 0;
        setCurrentTime(time);
        onSeek?.(time);
      });

      wavesurfer.current.on('finish', () => {
        setIsPlaying(false);
      });

      return () => {
        wavesurfer.current?.destroy();
      };
    } catch (err) {
      console.error('Error initializing WaveSurfer:', err);
      toast({
        title: "Error",
        description: "Failed to initialize audio player. Please try again.",
        variant: "destructive",
      });
    }
  }, [url, height, waveColor, progressColor, onReady, onTimeUpdate, zoom]);

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (wavesurfer.current) {
      const newVolume = volume === 0 ? 1 : 0;
      wavesurfer.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  };

  const handleZoomIn = () => {
    if (wavesurfer.current && isReady) {
      try {
        const newZoom = Math.min(zoom + 10, 100);
        wavesurfer.current.zoom(newZoom);
        setZoom(newZoom);
      } catch (err) {
        console.error('Error zooming in:', err);
        toast({
          title: "Error",
          description: "Failed to zoom in. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleZoomOut = () => {
    if (wavesurfer.current && isReady) {
      try {
        const newZoom = Math.max(zoom - 10, 20);
        wavesurfer.current.zoom(newZoom);
        setZoom(newZoom);
      } catch (err) {
        console.error('Error zooming out:', err);
        toast({
          title: "Error",
          description: "Failed to zoom out. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="w-full rounded-lg glass p-4" />
      
      <WaveformControls
        isPlaying={isPlaying}
        isReady={isReady}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={togglePlayPause}
        onVolumeChange={handleVolumeChange}
        onMute={toggleMute}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
};