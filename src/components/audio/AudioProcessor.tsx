import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AudioProcessingState } from '@/types/audio/processing';
import { processAudioBuffer, transcribeAudio } from '@/utils/audio/processing';
import { analyzeSentiment, analyzeTone } from '@/utils/audio/analysis';
import { AudioProcessingControls } from './AudioProcessingControls';
import { AudioSettings } from '@/types/audio/settings';
import { AudioVisualizer } from './processor/AudioVisualizer';
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
  const [state, setState] = useState<AudioProcessingState>({
    currentTime: 0,
    isPlaying: false,
    duration: 0,
    isReady: false,
    isTranscribing: false,
    transcriptions: [],
    error: null
  });

  // Immediately show waveform
  useEffect(() => {
    if (audioUrl) {
      setState(prev => ({ ...prev, isReady: true }));
    }
  }, [audioUrl]);

  const processAudio = useCallback(async () => {
    if (!audioUrl) return;

    try {
      // Start processing in parallel
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch audio file');
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioData = await processAudioBuffer(arrayBuffer);

      // Start transcription process
      setState(prev => ({ ...prev, isTranscribing: true }));
      
      // Run transcription, sentiment and tone analysis in parallel
      const [transcriptionResult, sentimentResult, toneResult] = await Promise.allSettled([
        transcribeAudio(audioData).catch(error => {
          console.error('Transcription error:', error);
          toast({
            title: "Transcription Warning",
            description: "Failed to transcribe audio, but continuing with other processing",
            variant: "destructive",
          });
          return [];
        }),
        analyzeSentiment("").catch(error => {
          console.error('Sentiment analysis error:', error);
          return 'neutral';
        }),
        analyzeTone(audioData).catch(error => {
          console.error('Tone analysis error:', error);
          return null;
        })
      ]);

      // Handle transcription results
      if (transcriptionResult.status === 'fulfilled' && transcriptionResult.value.length > 0) {
        setState(prev => ({ 
          ...prev, 
          transcriptions: transcriptionResult.value,
          isTranscribing: false 
        }));

        toast({
          title: "Processing complete",
          description: "Audio has been successfully transcribed",
        });
      } else {
        console.warn('Transcription failed or returned empty results');
        setState(prev => ({ ...prev, isTranscribing: false }));
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
      <AudioVisualizer
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