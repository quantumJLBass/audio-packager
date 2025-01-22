import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useToast } from '@/hooks/use-toast';

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
      onReady?.();
    });

    wavesurfer.current.on('error', (err) => {
      console.error('WaveSurfer error:', err);
      setError('Failed to load audio file');
      toast({
        title: 'Error',
        description: 'Failed to load audio file. Please try again or select a different file.',
        variant: 'destructive',
      });
    });

    wavesurfer.current.on('audioprocess', (time) => {
      onTimeUpdate?.(time);
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [url, height, waveColor, progressColor, onReady, onTimeUpdate]);

  if (error) {
    return (
      <div className="w-full rounded-lg glass p-4 flex items-center justify-center text-gray-500">
        <p>No audio file loaded. Please select an audio file to visualize the waveform.</p>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full rounded-lg glass p-4" />;
};