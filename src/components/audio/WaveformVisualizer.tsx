import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WaveformCore } from './waveform/WaveformCore';
import { WaveformControls } from './waveform/WaveformControls';
import { WaveformVisualizerProps } from '@/types/audio';
import { useToast } from '@/hooks/use-toast';
import { processAudioBuffer, transcribeAudio } from '@/utils/audio/processing';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { Transcription } from '@/types/audio/transcription';
import { Loader2 } from 'lucide-react';

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  url,
  speakers,
  onTimeUpdate,
  onSeek,
  onPlayPause,
  onReady,
  onDurationChange,
  settings
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(settings.defaultZoom);
  const [volume, setVolume] = useState(1);
  const [showSpectrogram, setShowSpectrogram] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { toast } = useToast();
  const transcriptionStarted = useRef(false);

  const handleReady = useCallback(() => {
    setIsReady(true);
    onReady?.();
  }, [onReady]);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    onTimeUpdate(time);
  }, [onTimeUpdate]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    onPlayPause?.(!isPlaying);
  }, [isPlaying, onPlayPause]);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    setVolume(newVolume[0]);
  }, []);

  const handleMute = useCallback(() => {
    setVolume(prev => prev === 0 ? 1 : 0);
  }, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    if (!isReady) {
      toast({
        title: "Error",
        description: "Please wait for audio to load before zooming",
        variant: "destructive",
      });
      return;
    }
    setZoom(newZoom);
  }, [isReady, toast]);

  useEffect(() => {
    const startTranscription = async () => {
      if (!url || isTranscribing || transcriptionStarted.current) return;
      
      transcriptionStarted.current = true;
      setIsTranscribing(true);
      
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioData = await processAudioBuffer(arrayBuffer);
        
        const results = await transcribeAudio(audioData);
        setTranscriptions(results);
        
        toast({
          title: "Success",
          description: "Audio transcription completed",
          duration: 3000,
        });
      } catch (error) {
        console.error('Transcription error:', error);
        toast({
          title: "Error",
          description: "Failed to transcribe audio",
          variant: "destructive",
        });
        transcriptionStarted.current = false;
      } finally {
        setIsTranscribing(false);
      }
    };

    if (isReady) {
      startTranscription();
    }
  }, [url, isReady, isTranscribing, toast]);

  useEffect(() => {
    if (duration > 0) {
      onDurationChange?.(duration);
    }
  }, [duration, onDurationChange]);

  return (
    <div className="space-y-4">
      <WaveformCore
        url={url}
        onReady={handleReady}
        onTimeUpdate={handleTimeUpdate}
        minPxPerSec={zoom}
      />
      
      <WaveformControls
        isPlaying={isPlaying}
        isReady={isReady}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        zoom={zoom}
        showSpectrogram={showSpectrogram}
        showRegions={showRegions}
        onPlayPause={handlePlayPause}
        onVolumeChange={handleVolumeChange}
        onMute={handleMute}
        onZoomIn={() => handleZoomChange(Math.min(settings.maxZoom, zoom + settings.zoomStep))}
        onZoomOut={() => handleZoomChange(Math.max(settings.minZoom, zoom - settings.zoomStep))}
        onZoomChange={handleZoomChange}
        onToggleSpectrogram={() => setShowSpectrogram(prev => !prev)}
        onToggleRegions={() => setShowRegions(prev => !prev)}
      />
      
      {isTranscribing && (
        <div className="flex items-center justify-center p-4 space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Transcribing audio...</span>
        </div>
      )}
      
      {transcriptions.length > 0 && (
        <TranscriptionDisplay
          transcriptions={transcriptions}
          currentTime={currentTime}
          onTimeClick={handleTimeUpdate}
        />
      )}
    </div>
  );
};