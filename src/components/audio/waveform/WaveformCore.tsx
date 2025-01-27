import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformCoreProps {
  url: string;
  onReady: () => void;
  onTimeUpdate: (time: number) => void;
  minPxPerSec?: number;
  waveColor?: string;
  progressColor?: string;
  height?: number;
}

export const WaveformCore: React.FC<WaveformCoreProps> = ({
  url,
  onReady,
  onTimeUpdate,
  minPxPerSec = 100,
  waveColor = '#4f46e5',
  progressColor = '#7c3aed',
  height = 128,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      height,
      normalize: true,
      minPxPerSec,
    });

    wavesurfer.current.load(url);
    wavesurfer.current.on('ready', onReady);
    wavesurfer.current.on('timeupdate', onTimeUpdate);

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [url, onReady, onTimeUpdate, waveColor, progressColor, height, minPxPerSec]);

  return <div ref={containerRef} />;
};