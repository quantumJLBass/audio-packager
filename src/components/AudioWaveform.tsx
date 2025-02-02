import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { WaveformControls } from './audio/WaveformControls';
import { WaveformPlugins } from './audio/waveform/WaveformPlugins';
import { WaveformTimeline } from './audio/waveform/Timeline';
import { useToast } from '@/hooks/use-toast';
import { getSettings } from '@/utils/settings';

interface AudioWaveformProps {
  url: string;
  onReady?: () => void;
  onTimeUpdate?: (time: number) => void;
  onSeek?: (time: number) => void;
  onError?: (error: Error) => void;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  url,
  onReady,
  onTimeUpdate,
  onSeek,
  onError,
}) => {
  const settings = getSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(settings.defaultZoom);
  const [isReady, setIsReady] = useState(false);
  const [showSpectrogram, setShowSpectrogram] = useState(false);
  const [showRegions, setShowRegions] = useState(true);
  const { toast } = useToast();
  const isInitializing = useRef(false);
  const previousUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !url || isInitializing.current || url === previousUrl.current) {
      return;
    }

    const initWaveSurfer = async () => {
      try {
        isInitializing.current = true;
        console.log('Initializing WaveSurfer with URL:', url);

        if (wavesurfer.current) {
          wavesurfer.current.destroy();
          wavesurfer.current = null;
        }

        const instance = WaveSurfer.create({
          container: containerRef.current!,
          height: settings.waveformHeight,
          waveColor: settings.waveformColors.waveform,
          progressColor: settings.waveformColors.progress,
          cursorWidth: 1,
          cursorColor: settings.waveformColors.cursor,
          normalize: true,
          minPxPerSec: zoom,
          fillParent: true,
          interact: true,
          autoScroll: true,
          hideScrollbar: true,
          autoCenter: false
        });

        instance.on('ready', () => {
          console.log('WaveSurfer ready');
          setDuration(instance.getDuration());
          setIsReady(true);
          previousUrl.current = url;
          onReady?.();
        });

        instance.on('error', (err) => {
          console.error('WaveSurfer error:', err);
          onError?.(err);
          toast({
            title: "Error",
            description: "Failed to load audio file",
            variant: "destructive",
          });
        });

        instance.on('audioprocess', (time) => {
          setCurrentTime(time);
          onTimeUpdate?.(time);
        });

        instance.on('interaction', () => {
          const time = instance.getCurrentTime();
          setCurrentTime(time);
          onSeek?.(time);
        });

        instance.on('finish', () => setIsPlaying(false));
        instance.on('play', () => setIsPlaying(true));
        instance.on('pause', () => setIsPlaying(false));

        await instance.load(url);
        wavesurfer.current = instance;
      } catch (err) {
        console.error('Error initializing WaveSurfer:', err);
        onError?.(err as Error);
        toast({
          title: "Error",
          description: "Failed to initialize audio player",
          variant: "destructive",
        });
      } finally {
        isInitializing.current = false;
      }
    };

    initWaveSurfer();

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [url, onReady, onTimeUpdate, zoom, toast, onError]);

  const handleZoom = (newZoom: number) => {
    if (wavesurfer.current && isReady) {
      try {
        requestAnimationFrame(() => {
          wavesurfer.current?.zoom(newZoom);
          setZoom(newZoom);
        });
      } catch (err) {
        console.error('Error zooming:', err);
        toast({
          title: "Error",
          description: "Failed to zoom",
          variant: "destructive",
        });
      }
    }
  };

  const togglePlayPause = () => {
    if (wavesurfer.current && isReady) {
      wavesurfer.current.playPause();
    }
  };

  const toggleMute = () => {
    if (wavesurfer.current && isReady) {
      const newVolume = volume === 0 ? 1 : 0;
      wavesurfer.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (wavesurfer.current && isReady) {
      wavesurfer.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg bg-gray-900 p-4">
        <div ref={containerRef} className="w-full" />
        <WaveformTimeline wavesurfer={wavesurfer.current} zoom={zoom} />
        <WaveformPlugins 
          wavesurfer={wavesurfer.current}
          settings={settings}
          showSpectrogram={showSpectrogram}
          showRegions={showRegions}
        />
      </div>
      
      <WaveformControls
        isPlaying={isPlaying}
        isReady={isReady}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        zoom={zoom}
        showSpectrogram={showSpectrogram}
        showRegions={showRegions}
        onPlayPause={togglePlayPause}
        onVolumeChange={handleVolumeChange}
        onMute={toggleMute}
        onZoomIn={() => handleZoom(Math.min(zoom + 50, 500))}
        onZoomOut={() => handleZoom(Math.max(zoom - 50, 50))}
        onZoomChange={handleZoom}
        onToggleSpectrogram={() => setShowSpectrogram(!showSpectrogram)}
        onToggleRegions={() => setShowRegions(!showRegions)}
      />
    </div>
  );
};