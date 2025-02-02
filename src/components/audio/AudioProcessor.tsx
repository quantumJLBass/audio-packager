import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProcessingState } from '@/types/audio/processing';
import { processAudioBuffer, transcribeAudio } from '@/utils/audio/processing';
import { analyzeSentiment, analyzeTone } from '@/utils/audio/analysis';
import { AudioProcessingControls } from './AudioProcessingControls';
import { AudioSettings } from '@/types/audio/settings';
import { ImmediateAudioVisualizer } from './processor/ImmediateAudioVisualizer';
import { AudioProcessingStateComponent } from './processor/AudioProcessingState';

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
  const processingRef = useRef(false);
  const [state, setState] = useState<AudioProcessingState>({
    currentTime: 0,
    isPlaying: false,
    duration: 0,
    isReady: false,
    isTranscribing: false,
    transcriptions: [],
    error: null
  });

  const processAudio = useCallback(async () => {
    if (!audioUrl || processingRef.current) return;

    try {
      processingRef.current = true;
      setState(prev => ({ ...prev, isTranscribing: true, error: null }));
      
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioData = await processAudioBuffer(arrayBuffer);

      const transcriptionResult = await transcribeAudio(audioData);
      
      setState(prev => ({ 
        ...prev, 
        transcriptions: transcriptionResult,
        isTranscribing: false 
      }));

      toast({
        title: "Processing complete",
        description: "Audio has been successfully transcribed",
      });

    } catch (error) {
      console.error('Error processing audio:', error);
      setState(prev => ({ 
        ...prev, 
        isTranscribing: false,
        error: error instanceof Error ? error.message : 'Failed to process audio file'
      }));
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process audio file",
        variant: "destructive",
      });
    } finally {
      processingRef.current = false;
    }
  }, [audioUrl, toast]);

  useEffect(() => {
    if (audioUrl) {
      processAudio();
    }
    return () => {
      if (audioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, processAudio]);

  const handleTimeUpdate = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const handlePlayPause = useCallback((isPlaying: boolean) => {
    setState(prev => ({ ...prev, isPlaying }));
  }, []);

  const handleReady = useCallback(() => {
    setState(prev => ({ ...prev, isReady: true }));
  }, []);

  const handleDurationChange = useCallback((duration: number) => {
    setState(prev => ({ ...prev, duration }));
  }, []);

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