import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
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
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !url || isInitializing.current) return;

    const initWaveSurfer = async () => {
      try {
        isInitializing.current = true;
        console.log('Initializing WaveSurfer in AudioWaveform');

        if (wavesurfer.current) {
          wavesurfer.current.destroy();
          wavesurfer.current = null;
        }

        const instance = WaveSurfer.create({
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

        instance.on('ready', () => {
          console.log('WaveSurfer ready in AudioWaveform');
          setDuration(instance.getDuration());
          setIsReady(true);
          onReady?.();
        });

        instance.on('audioprocess', (time) => {
          setCurrentTime(time);
          onTimeUpdate?.(time);
        });

        instance.on('interaction', () => {
          const time = instance.getCurrentTime();
          setCurrentTime(time);
          onSeek?.(time);
        });

        instance.on('finish', () => {
          setIsPlaying(false);
        });

        await instance.load(url);
        wavesurfer.current = instance;
      } catch (err) {
        console.error('Error initializing WaveSurfer in AudioWaveform:', err);
        toast({
          title: "Error",
          description: "Failed to initialize audio player. Please try again.",
          variant: "destructive",
        });
      } finally {
        isInitializing.current = false;
      }
    };

    initWaveSurfer();

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [url, height, waveColor, progressColor, onReady, onTimeUpdate, zoom]);

  const handleZoom = debounce((newZoom: number) => {
    if (wavesurfer.current && isReady) {
      try {
        console.log('Applying zoom:', newZoom);
        // Store current time to maintain position
        const currentTime = wavesurfer.current.getCurrentTime();
        
        // Apply zoom using minPxPerSec
        wavesurfer.current.zoom(newZoom);
        
        // Seek to maintain position after zoom
        const progress = currentTime / duration;
        wavesurfer.current.seekTo(progress);
        
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