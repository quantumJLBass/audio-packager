import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';
import Regions from 'wavesurfer.js/dist/plugins/regions';
import Spectrogram from 'wavesurfer.js/dist/plugins/spectrogram';
import { useToast } from '@/hooks/use-toast';
import { Speaker } from '@/types/audio';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface WaveformVisualizerProps {
  url: string;
  speakers: Speaker[];
  onReady?: () => void;
  onTimeUpdate?: (time: number) => void;
  onSeek?: (time: number) => void;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  url,
  speakers,
  onReady,
  onTimeUpdate,
  onSeek,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spectrogramRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [showRegions, setShowRegions] = useState(true);
  const [showSpectrogram, setShowSpectrogram] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      wavesurfer.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#4f46e5',
        progressColor: '#7c3aed',
        height: 128,
        minPxPerSec: 100,
        normalize: true,
        interact: true,
        autoScroll: true,
        fillParent: true,
        plugins: [
          Minimap.create({
            height: 20,
            waveColor: '#ddd',
            progressColor: '#999',
          }),
          Regions.create(),
          showSpectrogram && Spectrogram.create({
            container: spectrogramRef.current!,
            labels: true,
            height: 200,
            splitChannels: true,
            scale: 'mel',
            frequencyMax: 8000,
            frequencyMin: 0,
            fftSamples: 1024,
            labelsBackground: 'rgba(0, 0, 0, 0.1)',
          }),
        ].filter(Boolean),
      });

      wavesurfer.current.load(url);

      wavesurfer.current.on('ready', () => {
        console.log('WaveSurfer ready');
        updateRegions();
        onReady?.();
      });

      wavesurfer.current.on('timeupdate', (time) => {
        onTimeUpdate?.(time);
      });

      wavesurfer.current.on('seeking', () => {
        const time = wavesurfer.current?.getCurrentTime() || 0;
        onSeek?.(time);
      });

      return () => {
        wavesurfer.current?.destroy();
      };
    } catch (err) {
      console.error('Error initializing WaveSurfer:', err);
      toast({
        title: "Error",
        description: "Failed to initialize audio visualizer",
        variant: "destructive",
      });
    }
  }, [url, showSpectrogram]);

  const updateRegions = () => {
    if (!wavesurfer.current || !showRegions) return;

    // Clear existing regions
    wavesurfer.current.regions.clear();

    // Create regions for each speaker
    speakers.forEach((speaker) => {
      wavesurfer.current?.regions.add({
        id: speaker.id,
        start: 0, // You'll need to update these based on actual speaker timestamps
        end: wavesurfer.current.getDuration(),
        color: `${speaker.color}33`,
        drag: false,
        resize: false,
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-regions"
            checked={showRegions}
            onCheckedChange={setShowRegions}
          />
          <Label htmlFor="show-regions">Show Regions</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-spectrogram"
            checked={showSpectrogram}
            onCheckedChange={setShowSpectrogram}
          />
          <Label htmlFor="show-spectrogram">Show Spectrogram</Label>
        </div>
      </div>
      
      <div ref={containerRef} className="w-full rounded-lg glass p-4" />
      {showSpectrogram && (
        <div ref={spectrogramRef} className="w-full rounded-lg glass p-4" />
      )}
    </div>
  );
};