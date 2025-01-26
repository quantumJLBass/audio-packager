import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';
import Spectrogram from 'wavesurfer.js/dist/plugins/spectrogram';
import Timeline from 'wavesurfer.js/dist/plugins/timeline';
import { useToast } from '@/hooks/use-toast';
import { Speaker } from '@/types/audio';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { formatTimestamp } from '@/utils/timeFormat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const timelineRef = useRef<HTMLDivElement>(null);
  const spectrogramRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [showRegions, setShowRegions] = useState(true);
  const [showSpectrogram, setShowSpectrogram] = useState(false);
  const [zoom, setZoom] = useState(100);
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const regionsPlugin = RegionsPlugin.create();
      
      wavesurfer.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#4f46e5',
        progressColor: '#7c3aed',
        height: 128,
        minPxPerSec: zoom,
        normalize: true,
        interact: true,
        autoScroll: true,
        fillParent: true,
        plugins: [
          Minimap.create({
            container: minimapRef.current!,
            height: 20,
            waveColor: '#ddd',
            progressColor: '#999',
          }),
          Timeline.create({
            container: timelineRef.current!,
            formatTimeCallback: (seconds: number) => formatTimestamp(seconds),
            primaryLabelInterval: zoom < 50 ? 1 : zoom < 100 ? 5 : 10,
            secondaryLabelInterval: zoom < 50 ? 0.1 : zoom < 100 ? 1 : 5,
          }),
          regionsPlugin,
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
        if (showRegions) {
          updateRegions();
        }
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
  }, [url, showSpectrogram, zoom]);

  const updateRegions = () => {
    if (!wavesurfer.current) return;

    const regions = wavesurfer.current.getActivePlugins().find(p => p instanceof RegionsPlugin) as RegionsPlugin;
    if (!regions) return;

    regions.clearRegions();

    if (showRegions) {
      speakers.forEach((speaker) => {
        regions.addRegion({
          id: speaker.id,
          start: 0,
          end: wavesurfer.current?.getDuration() || 0,
          color: `${speaker.color}33`,
          drag: false,
          resize: false,
        });
      });
    }
  };

  const handleZoomChange = (newZoom: number) => {
    if (wavesurfer.current) {
      wavesurfer.current.zoom(newZoom);
      setZoom(newZoom);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => handleZoomChange(Math.max(20, zoom - 20))}
            disabled={zoom <= 20}
          >
            Zoom Out
          </Button>
          <span>{zoom}%</span>
          <Button 
            variant="outline" 
            onClick={() => handleZoomChange(Math.min(500, zoom + 20))}
            disabled={zoom >= 500}
          >
            Zoom In
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-regions"
              checked={showRegions}
              onCheckedChange={(checked) => {
                setShowRegions(checked);
                updateRegions();
              }}
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
      </div>
      
      <div ref={minimapRef} className="w-full h-[20px]" />
      <div ref={containerRef} className="w-full rounded-lg glass p-4" />
      <div ref={timelineRef} className="w-full" />
      {showSpectrogram && (
        <div ref={spectrogramRef} className="w-full rounded-lg glass p-4" />
      )}
    </div>
  );
};