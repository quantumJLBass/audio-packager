import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useToast } from '@/hooks/use-toast';
import { WaveformControls } from './audio/WaveformControls';
import { debounce } from 'lodash';

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
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initWaveSurfer = async () => {
      try {
        // Cleanup previous instance and abort controller
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
          wavesurfer.current = null;
        }
        if (abortController.current) {
          abortController.current.abort();
        }
        abortController.current = new AbortController();

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

        // Load audio with abort signal
        await wavesurfer.current.load(url, undefined, abortController.current.signal);

        wavesurfer.current.on('ready', () => {
          console.log('WaveSurfer ready');
          setDuration(wavesurfer.current?.getDuration() || 0);
          setIsReady(true);
          onReady?.();
        });

        wavesurfer.current.on('error', (err) => {
          // Ignore abort errors during cleanup
          if (err.name === 'AbortError') {
            console.log('Audio loading aborted');
            return;
          }
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
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Audio loading aborted');
          return;
        }
        console.error('Error initializing WaveSurfer:', err);
        toast({
          title: "Error",
          description: "Failed to initialize audio player. Please try again.",
          variant: "destructive",
        });
      }
    };

    initWaveSurfer();

    return () => {
      // Cleanup on unmount
      if (abortController.current) {
        abortController.current.abort();
      }
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [url, height, waveColor, progressColor, onReady, onTimeUpdate, zoom]);

  const handleZoom = debounce((newZoom: number) => {
    if (wavesurfer.current && isReady) {
      try {
        const currentTime = wavesurfer.current.getCurrentTime();
        wavesurfer.current.zoom(newZoom);
        wavesurfer.current.seekTo(currentTime / duration);
        setZoom(newZoom);
      } catch (err) {
        console.error('Error zooming:', err);
        toast({
          title: "Error",
          description: "Failed to zoom. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, 100);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, 100);
    handleZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, 20);
    handleZoom(newZoom);
  };

  const handleZoomChange = (newZoom: number) => {
    handleZoom(newZoom);
  };

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

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="w-full rounded-lg glass p-4" />
      
      <WaveformControls
        isPlaying={isPlaying}
        isReady={isReady}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        zoom={zoom}
        onPlayPause={togglePlayPause}
        onVolumeChange={handleVolumeChange}
        onMute={toggleMute}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomChange={handleZoomChange}
      />
    </div>
  );
};