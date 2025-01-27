import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WaveformVisualizer } from './WaveformVisualizer';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { useToast } from '@/hooks/use-toast';
import { Transcription, AudioProcessingState } from '@/types/audio';
import { processAudioBuffer, transcribeAudio } from '@/utils/audioProcessing';
import { AudioProcessingControls } from './AudioProcessingControls';
import { AudioSettings } from '@/utils/settings';
import { Loader2 } from 'lucide-react';

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
      const result = await transcribeAudio(audioData, settings);
      
      setState(prev => ({ 
        ...prev, 
        transcriptions: result,
        isTranscribing: false,
        error: null
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
    }
  }, [audioUrl, settings, toast]);

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
      <Card className="p-6 text-center text-red-500">
        <p>Error: {state.error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Audio Visualization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <WaveformVisualizer
            key={audioUrl}
            url={audioUrl}
            speakers={[]}
            onTimeUpdate={handleTimeUpdate}
            onPlayPause={handlePlayPause}
            onReady={handleReady}
            onDurationChange={handleDurationChange}
            settings={settings}
          />
        </CardContent>
      </Card>

      <AudioProcessingControls
        {...state}
        onPlayPause={() => handlePlayPause(!state.isPlaying)}
      />

      {state.isTranscribing ? (
        <Card className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Transcribing audio...</p>
        </Card>
      ) : (
        <TranscriptionDisplay
          transcriptions={state.transcriptions}
          currentTime={state.currentTime}
          onTimeClick={handleTimeUpdate}
          settings={settings}
        />
      )}
    </div>
  );
};