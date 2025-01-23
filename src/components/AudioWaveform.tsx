import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, Volume2, VolumeX, ZoomIn, ZoomOut } from 'lucide-react';

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
    if (wavesurfer.current) {
      const newZoom = Math.min(zoom + 10, 100);
      setZoom(newZoom);
      wavesurfer.current.zoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (wavesurfer.current) {
      const newZoom = Math.max(zoom - 10, 20);
      setZoom(newZoom);
      wavesurfer.current.zoom(newZoom);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="w-full rounded-lg glass p-4" />
      
      <div className="flex items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="hover:bg-primary/20"
          >
            {isPlaying ? (
              <PauseCircle className="h-6 w-6" />
            ) : (
              <PlayCircle className="h-6 w-6" />
            )}
          </Button>
          
          <span className="text-sm font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="hover:bg-primary/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="hover:bg-primary/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="hover:bg-primary/20"
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <div className="w-24">
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};