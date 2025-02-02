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
  const [showSpectrogram, setShowSpectrogram] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current || !url) return;

    const initWaveSurfer = async () => {
      try {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }

        const ws = WaveSurfer.create({
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

        wavesurfer.current = ws;

        ws.on('ready', () => {
          console.log('WaveSurfer ready');
          setDuration(ws.getDuration());
          setIsReady(true);
          onReady?.();
        });

        ws.on('error', (err) => {
          console.error('WaveSurfer error:', err);
          toast({
            title: "Error",
            description: "Failed to load audio file. Please try again.",
            variant: "destructive",
          });
        });

        ws.on('audioprocess', (time) => {
          setCurrentTime(time);
          onTimeUpdate?.(time);
        });

        ws.on('interaction', () => {
          const time = ws.getCurrentTime();
          setCurrentTime(time);
          onSeek?.(time);
        });

        ws.on('finish', () => {
          setIsPlaying(false);
        });

        await ws.load(url);
      } catch (err) {
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
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [url, height, waveColor, progressColor, onReady, onTimeUpdate, zoom]);

  const handleZoom = debounce((newZoom: number) => {
    console.log('Zooming to:', newZoom);
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

  const handleToggleSpectrogram = () => {
    setShowSpectrogram(!showSpectrogram);
  };

  const handleToggleRegions = () => {
    setShowRegions(!showRegions);
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
        showSpectrogram={showSpectrogram}
        showRegions={showRegions}
        onPlayPause={togglePlayPause}
        onVolumeChange={handleVolumeChange}
        onMute={toggleMute}
        onZoomIn={() => handleZoom(Math.min(500, zoom + 50))}
        onZoomOut={() => handleZoom(Math.max(50, zoom - 50))}
        onZoomChange={handleZoom}
        onToggleSpectrogram={handleToggleSpectrogram}
        onToggleRegions={handleToggleRegions}
      />
    </div>
  );
};