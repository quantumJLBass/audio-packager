import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

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

    wavesurfer.current.on('audioprocess', (time) => {
      onTimeUpdate?.(time);
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [url]);

  return <div ref={containerRef} className="w-full rounded-lg glass p-4" />;
};