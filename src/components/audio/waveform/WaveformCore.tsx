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
  const [isDestroying, setIsDestroying] = useState(false);
  const { toast } = useToast();
  const urlRef = useRef(url);
  const initializationAttempts = useRef(0);
  const MAX_INITIALIZATION_ATTEMPTS = 3;

  useEffect(() => {
    let isSubscribed = true;
    let abortController: AbortController | null = null;

    const initWaveSurfer = async () => {
      if (!containerRef.current || isInitializing || isDestroying) {
        console.log('Skipping initialization - conditions not met:', {
          hasContainer: !!containerRef.current,
          isInitializing,
          isDestroying
        });
        return;
      }

      if (initializationAttempts.current >= MAX_INITIALIZATION_ATTEMPTS) {
        console.error('Max initialization attempts reached');
        toast({
          title: "Error",
          description: "Failed to initialize audio player after multiple attempts",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsInitializing(true);
        initializationAttempts.current += 1;
        console.log('Initializing WaveSurfer...', { 
          url,
          attempt: initializationAttempts.current 
        });

        // Cleanup previous instance
        if (wavesurfer.current) {
          console.log('Destroying previous WaveSurfer instance');
          setIsDestroying(true);
          wavesurfer.current.destroy();
          wavesurfer.current = null;
          setIsDestroying(false);
        }

        // Only create new instance if URL changed
        if (urlRef.current !== url && isSubscribed) {
          console.log('Creating new WaveSurfer instance');
          abortController = new AbortController();

          wavesurfer.current = WaveSurfer.create({
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

          wavesurfer.current.on('ready', () => {
            if (isSubscribed) {
              console.log('WaveSurfer ready');
              initializationAttempts.current = 0;
              onReady();
            }
          });

          wavesurfer.current.on('timeupdate', (time) => {
            if (isSubscribed) {
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

          // Load the audio file without the abort signal parameter
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
      if (abortController) {
        abortController.abort();
      }
      if (wavesurfer.current) {
        console.log('Cleaning up WaveSurfer');
        setIsDestroying(true);
        wavesurfer.current.destroy();
        wavesurfer.current = null;
        setIsDestroying(false);
      }
    };
  }, [url, waveColor, progressColor, height, minPxPerSec, onReady, onTimeUpdate, toast]);

  return <div ref={containerRef} className="w-full h-full" />;
};