import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AudioProcessingState } from '@/types/audio/processing';
import { processAudioBuffer, transcribeAudio } from '@/utils/audio/processing';
import { analyzeSentiment, analyzeTone } from '@/utils/audio/analysis';
import { AudioProcessingControls } from './AudioProcessingControls';
import { AudioSettings } from '@/types/audio/settings';
import { AudioVisualization } from './AudioVisualization';
import { TranscriptionSection } from './TranscriptionSection';
import { ProcessingStatus } from './processing/ProcessingStatus';
import { Transcription } from '@/types/audio/transcription';

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
    if (!audioUrl) return;

    // Start with waveform visualization immediately
    setState(prev => ({ ...prev, isReady: true }));

    try {
      // Process audio in parallel
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch audio file');
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioData = await processAudioBuffer(arrayBuffer);

      // Start transcription process
      setState(prev => ({ ...prev, isTranscribing: true }));
      
      // Run transcription, sentiment and tone analysis in parallel
      const [transcriptions, sentiment, tone] = await Promise.allSettled([
        transcribeAudio(audioData),
        analyzeSentiment(""), // Will be updated with actual text once transcription is done
        analyzeTone(audioData)
      ]);

      // Handle transcription results
      if (transcriptions.status === 'fulfilled' && transcriptions.value.length > 0) {
        setState(prev => ({ 
          ...prev, 
          transcriptions: transcriptions.value,
          isTranscribing: false 
        }));

        toast({
          title: "Processing complete",
          description: "Audio has been successfully transcribed",
        });
      } else {
        console.warn('Transcription failed or returned empty results');
        toast({
          title: "Warning",
          description: "Transcription completed but no results were found",
          variant: "destructive",
        });
      }
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
      <AudioVisualization
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

      <ProcessingStatus
        isTranscribing={state.isTranscribing}
        error={state.error}
      />

      {!state.isTranscribing && !state.error && state.transcriptions.length > 0 && (
        <TranscriptionSection
          transcriptions={state.transcriptions}
          currentTime={state.currentTime}
          onTimeClick={handleTimeUpdate}
        />
      )}
    </div>
  );
};