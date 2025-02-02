import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useToast } from '@/hooks/use-toast';

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
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const previousUrl = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initWaveSurfer = async () => {
      if (!containerRef.current || !url || url === previousUrl.current) {
        return;
      }

      try {
        console.log('Initializing WaveSurfer...', { url });
        
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
          wavesurfer.current = null;
        }

        const instance = WaveSurfer.create({
          container: containerRef.current,
          waveColor,
          progressColor,
          height,
          normalize: true,
          minPxPerSec,
          backend: 'WebAudio',
          autoCenter: true,
          fillParent: true,
          interact: true,
          mediaControls: true
        });

        instance.on('ready', () => {
          if (isMounted) {
            console.log('WaveSurfer ready');
            setIsInitialized(true);
            previousUrl.current = url;
            onReady();
          }
        });

        instance.on('timeupdate', (time) => {
          if (isMounted) {
            onTimeUpdate(time);
          }
        });

        instance.on('error', (error) => {
          console.error('WaveSurfer error:', error);
          if (isMounted) {
            toast({
              title: "Error",
              description: "Failed to load audio waveform",
              variant: "destructive",
            });
          }
        });

        await instance.load(url);
        
        if (isMounted) {
          wavesurfer.current = instance;
        } else {
          instance.destroy();
        }
      } catch (error) {
        console.error('Error initializing WaveSurfer:', error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to initialize audio waveform",
            variant: "destructive",
          });
        }
      }
    };

    initWaveSurfer();

    return () => {
      isMounted = false;
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [url, waveColor, progressColor, height, minPxPerSec, onReady, onTimeUpdate, toast]);

  return <div ref={containerRef} className="w-full h-full" />;
};