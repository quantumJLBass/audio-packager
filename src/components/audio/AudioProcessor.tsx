import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProcessingState } from '@/types/audio/processing';
import { AudioSettings } from '@/types/audio/settings';
import { ImmediateAudioVisualizer } from './processor/ImmediateAudioVisualizer';
import { AudioProcessingStateComponent } from './processor/AudioProcessingState';
import { AudioProcessingControls } from './AudioProcessingControls';
import { DebugLogger } from '@/utils/debug';

interface AudioProcessorProps {
  audioUrl: string;
  file: File;
  settings: AudioSettings;
}

export const AudioProcessor: React.FC<AudioProcessorProps> = ({ 
  audioUrl, 
  file,
  settings 
}) => {
  const { toast } = useToast();
  const [state, setState] = useState<ProcessingState>({
    currentTime: 0,
    isPlaying: false,
    duration: 0,
    isReady: false,
    isTranscribing: false,
    transcriptions: [],
    error: null
  });

  const handleTimeUpdate = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const handlePlayPause = useCallback((isPlaying: boolean) => {
    setState(prev => ({ ...prev, isPlaying }));
  }, []);

  const handleReady = useCallback(() => {
    setState(prev => ({ ...prev, isReady: true }));
    toast({
      title: "Audio Ready",
      description: "Audio player is ready",
    });
  }, [toast]);

  const handleDurationChange = useCallback((duration: number) => {
    setState(prev => ({ ...prev, duration }));
  }, []);

  // Temporarily disable transcription process
  const handleTranscribe = useCallback(async () => {
    DebugLogger.log('AudioProcessor', 'Transcription temporarily disabled');
    toast({
      title: "Notice",
      description: "Transcription is temporarily disabled while we fix some issues",
    });
  }, [toast]);

  return (
    <div className="space-y-4">
      <ImmediateAudioVisualizer
        key={audioUrl}
        url={audioUrl}
        settings={settings}
        onTimeUpdate={handleTimeUpdate}
        onPlayPause={handlePlayPause}
        onReady={handleReady}
        onDurationChange={handleDurationChange}
      />

      <AudioProcessingControls
        {...state}
        onPlayPause={() => handlePlayPause(!state.isPlaying)}
      />

      <AudioProcessingStateComponent
        {...state}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};