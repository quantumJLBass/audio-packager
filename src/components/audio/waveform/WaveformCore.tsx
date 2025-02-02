import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useToast } from '@/hooks/use-toast';

interface WaveformCoreProps {
  url: string;
  onReady?: () => void;
  onTimeUpdate?: (time: number) => void;
  minPxPerSec?: number;
}

export const WaveformCore: React.FC<WaveformCoreProps> = ({
  url,
  onReady,
  onTimeUpdate,
  minPxPerSec = 100,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current) return;

    const initWaveSurfer = async () => {
      try {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }

        const instance = WaveSurfer.create({
          container: containerRef.current!,
          height: 128,
          waveColor: '#4a5568',
          progressColor: '#3182ce',
          minPxPerSec,
          fillParent: true,
          interact: true,
          autoScroll: true,
          normalize: true,
          backend: 'WebAudio'
        });

        instance.on('ready', () => {
          console.log('WaveSurfer ready');
          onReady?.();
        });

        instance.on('timeupdate', (time: number) => {
          onTimeUpdate?.(time);
        });

        instance.on('error', (err) => {
          console.error('WaveSurfer error:', err);
          toast({
            title: "Error",
            description: "Failed to load audio",
            variant: "destructive"
          });
        });

        await instance.load(url);
        wavesurfer.current = instance;

      } catch (error) {
        console.error('Error initializing WaveSurfer:', error);
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
        wavesurfer.current = null;
      }
    };
  }, [url, minPxPerSec, onReady, onTimeUpdate, toast]);

  return <div ref={containerRef} />;
};