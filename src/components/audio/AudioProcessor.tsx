import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AudioProcessingState } from '@/types/audio/processing';
import { processAudioBuffer, transcribeAudio, analyzeSentiment, analyzeTone } from '@/utils/audio/processing';
import { AudioProcessingControls } from './AudioProcessingControls';
import { AudioSettings } from '@/types/audio/settings';
import { Loader2 } from 'lucide-react';
import { AudioVisualization } from './AudioVisualization';
import { TranscriptionSection } from './TranscriptionSection';
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

    try {
      setState(prev => ({ ...prev, isTranscribing: true, error: null }));
      
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch audio file');
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioData = await processAudioBuffer(arrayBuffer);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Transcription timed out')), 60000);
      });
      
      const transcriptionPromise = transcribeAudio(audioData);
      const transcriptions = await Promise.race([transcriptionPromise, timeoutPromise]) as Transcription[];
      
      // Analyze sentiment and tone for each transcription
      const enhancedTranscriptions = await Promise.all(
        transcriptions.map(async (t) => {
          const sentiment = await analyzeSentiment(t.text);
          const tone = await analyzeTone(audioData);
          return { ...t, sentiment, tone };
        })
      );
      
      setState(prev => ({ 
        ...prev, 
        transcriptions: enhancedTranscriptions,
        isTranscribing: false,
        error: null
      }));
      
      toast({
        title: "Processing complete",
        description: "Audio has been successfully transcribed and analyzed",
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

  if (state.error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {state.error}</p>
      </div>
    );
  }

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

      {state.isTranscribing ? (
        <div className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Processing audio...</p>
        </div>
      ) : (
        <TranscriptionSection
          transcriptions={state.transcriptions}
          currentTime={state.currentTime}
          onTimeClick={handleTimeUpdate}
        />
      )}
    </div>
  );
};