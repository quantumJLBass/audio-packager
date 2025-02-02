import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useToast } from '@/hooks/use-toast';
import { WaveformControls } from './audio/waveform/WaveformControls';
import { debounce } from 'lodash';

interface AudioWaveformProps {
  url: string;
  height?: number;
  waveColor?: string;
  progressColor?: string;
  zoom?: number;
  onReady?: () => void;
  onTimeUpdate?: (time: number) => void;
  onSeek?: (time: number) => void;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  url,
  height = 128,
  waveColor = '#4a5568',
  progressColor = '#3182ce',
  zoom = 100,
  onReady,
  onTimeUpdate,
  onSeek,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showSpectrogram, setShowSpectrogram] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const { toast } = useToast();
  const urlRef = useRef(url);

  useEffect(() => {
    if (!containerRef.current) return;

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
          minPxPerSec: zoom,
          fillParent: true,
          interact: true,
          autoScroll: true,
          normalize: true,
          backend: 'WebAudio'
        });

        wavesurfer.current = ws;

        ws.on('ready', () => {
          console.log('WaveSurfer ready');
          setIsReady(true);
          setDuration(ws.getDuration());
          onReady?.();
        });

        ws.on('play', () => setIsPlaying(true));
        ws.on('pause', () => setIsPlaying(false));
        ws.on('timeupdate', (time: number) => {
          setCurrentTime(time);
          onTimeUpdate?.(time);
        });
        ws.on('seeking', (time: number) => {
          setCurrentTime(time);
          onSeek?.(time);
        });
        ws.on('error', (err) => {
          console.error('WaveSurfer error:', err);
          toast({
            title: "Error",
            description: "Failed to load audio",
            variant: "destructive"
          });
        });

        await ws.load(url);
        urlRef.current = url;
      } catch (err) {
        console.error('Error initializing WaveSurfer:', err);
        toast({
          title: "Error",
          description: "Failed to initialize audio player",
          variant: "destructive"
        });
      }
    };

    initWaveSurfer();

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [url, height, waveColor, progressColor, zoom, onReady, onTimeUpdate, onSeek, toast]);

  const handleZoom = debounce((newZoom: number) => {
    console.log('Zooming to:', newZoom);
    if (wavesurfer.current) {
      wavesurfer.current.zoom(newZoom);
    }
  }, 100);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  const handleVolumeChange = ([newVolume]: number[]) => {
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  };

  const handleMute = () => {
    if (wavesurfer.current) {
      const newVolume = volume === 0 ? 1 : 0;
      wavesurfer.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  };

  return (
    <div className="space-y-4">
      <div ref={containerRef} />
      <WaveformControls
        isPlaying={isPlaying}
        isReady={isReady}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        zoom={zoom}
        showSpectrogram={showSpectrogram}
        showRegions={showRegions}
        onPlayPause={handlePlayPause}
        onVolumeChange={handleVolumeChange}
        onMute={handleMute}
        onZoomIn={() => handleZoom(zoom + 50)}
        onZoomOut={() => handleZoom(Math.max(50, zoom - 50))}
        onZoomChange={handleZoom}
        onToggleSpectrogram={() => setShowSpectrogram(!showSpectrogram)}
        onToggleRegions={() => setShowRegions(!showRegions)}
      />
    </div>
  );
};