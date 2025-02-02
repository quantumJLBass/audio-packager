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
        console.log('Initializing WaveSurfer with URL:', url);

        if (wavesurfer.current) {
          wavesurfer.current.destroy();
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
          backend: 'WebAudio'
        });

        instance.on('ready', () => {
          console.log('WaveSurfer ready');
          setDuration(instance.getDuration());
          setIsReady(true);
          onReady?.();
        });

        instance.on('error', (err) => {
          console.error('WaveSurfer error:', err);
          toast({
            title: "Error",
            description: "Failed to load audio file. Please try again.",
            variant: "destructive",
          });
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

        console.log('Loading audio URL:', url);
        await instance.load(url);
        wavesurfer.current = instance;
      } catch (err) {
        console.error('Error initializing WaveSurfer:', err);
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
  }, [url, height, waveColor, progressColor, onReady, onTimeUpdate, zoom, toast]);

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
      <div ref={containerRef} className="w-full rounded-lg bg-gray-900 p-4" />
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
        onZoomIn={() => handleZoom(Math.min(zoom + 10, 100))}
        onZoomOut={() => handleZoom(Math.max(zoom - 10, 20))}
        onZoomChange={handleZoom}
      />
    </div>
  );
};