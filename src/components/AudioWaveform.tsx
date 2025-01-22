import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, Volume2, VolumeX } from 'lucide-react';

interface AudioWaveformProps {
  url: string;
  onReady?: () => void;
  onTimeUpdate?: (time: number) => void;
  height?: number;
  waveColor?: string;
  progressColor?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  url,
  onReady,
  onTimeUpdate,
  height = 128,
  waveColor = '#4a5568',
  progressColor = '#3182ce'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      height,
      waveColor,
      progressColor,
      cursorWidth: 1,
      cursorColor: '#718096',
      normalize: true,
      minPxPerSec: 50,
      fillParent: true,
      interact: true,
      autoScroll: true,
    });

    wavesurfer.current.load(url);

    wavesurfer.current.on('ready', () => {
      setDuration(wavesurfer.current?.getDuration() || 0);
      onReady?.();
    });

    wavesurfer.current.on('error', (err) => {
      console.error('WaveSurfer error:', err);
      setError('Failed to load audio file');
      toast({
        title: "Error",
        description: "Failed to load audio file. Please try again or select a different file.",
        variant: "destructive",
      });
    });

    wavesurfer.current.on('audioprocess', (time) => {
      setCurrentTime(time);
      onTimeUpdate?.(time);
    });

    wavesurfer.current.on('finish', () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [url, height, waveColor, progressColor, onReady, onTimeUpdate]);

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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="w-full rounded-lg glass p-4 flex items-center justify-center text-gray-500">
        <p>No audio file loaded. Please select an audio file to visualize the waveform.</p>
      </div>
    );
  }

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