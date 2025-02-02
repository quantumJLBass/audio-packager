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
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();
  const urlRef = useRef(url);

  useEffect(() => {
    let isSubscribed = true;

    const initWaveSurfer = async () => {
      if (!containerRef.current || isInitializing) return;

      try {
        setIsInitializing(true);
        console.log('Initializing WaveSurfer...', { url });

        // Cleanup previous instance
        if (wavesurfer.current) {
          console.log('Destroying previous WaveSurfer instance');
          wavesurfer.current.destroy();
          wavesurfer.current = null;
        }

        // Only create new instance if URL changed
        if (urlRef.current !== url && isSubscribed) {
          console.log('Creating new WaveSurfer instance');
          wavesurfer.current = WaveSurfer.create({
            container: containerRef.current,
            waveColor,
            progressColor,
            height,
            normalize: true,
            minPxPerSec,
            backend: 'WebAudio',
            autoCenter: true,
            responsive: true,
          });

          wavesurfer.current.on('ready', () => {
            if (isSubscribed) {
              console.log('WaveSurfer ready');
              onReady();
            }
          });

          wavesurfer.current.on('timeupdate', (time) => {
            if (isSubscribed) {
              console.log('Time update:', time);
              onTimeUpdate(time);
            }
          });

          wavesurfer.current.on('error', (error) => {
            console.error('WaveSurfer error:', error);
            if (isSubscribed) {
              toast({
                title: "Error",
                description: "Failed to load audio waveform",
                variant: "destructive",
              });
            }
          });

          await wavesurfer.current.load(url);
          urlRef.current = url;
        }
      } catch (error) {
        console.error('Error initializing WaveSurfer:', error);
        if (isSubscribed) {
          toast({
            title: "Error",
            description: "Failed to initialize audio waveform",
            variant: "destructive",
          });
        }
      } finally {
        if (isSubscribed) {
          setIsInitializing(false);
        }
      }
    };

    initWaveSurfer();

    return () => {
      isSubscribed = false;
      if (wavesurfer.current) {
        console.log('Cleaning up WaveSurfer');
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [url, waveColor, progressColor, height, minPxPerSec, onReady, onTimeUpdate]);

  return <div ref={containerRef} className="w-full h-full" />;
};