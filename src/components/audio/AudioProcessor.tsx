import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WaveformVisualizer } from './WaveformVisualizer';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { useToast } from '@/hooks/use-toast';
import { Transcription, AudioProcessingState } from '@/types/audio';
import { processAudioBuffer, transcribeAudio } from '@/utils/audioProcessing';
import { AudioProcessingControls } from './AudioProcessingControls';
import { getSettings } from '@/utils/settings';

interface AudioProcessorProps {
  audioUrl: string | null;
}

export const AudioProcessor: React.FC<AudioProcessorProps> = ({ audioUrl }) => {
  const { toast } = useToast();
  const settings = getSettings();
  const [state, setState] = useState<AudioProcessingState>({
    currentTime: 0,
    isPlaying: false,
    duration: 0,
    isReady: false,
    isTranscribing: false,
    transcriptions: [],
  });

  useEffect(() => {
    if (audioUrl) {
      processAudio();
    }
    
    return () => {
      // Cleanup any blob URLs
      if (audioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const processAudio = async () => {
    if (!audioUrl) return;

    try {
      setState(prev => ({ ...prev, isTranscribing: true }));
      
      const response = await fetch(audioUrl).catch(error => {
        console.error('Error fetching audio:', error);
        throw new Error('Failed to fetch audio file');
      });
      
      const arrayBuffer = await response.arrayBuffer().catch(error => {
        console.error('Error reading audio buffer:', error);
        throw new Error('Failed to read audio file');
      });
      
      const audioData = await processAudioBuffer(arrayBuffer);
      const result = await transcribeAudio(audioData);
      
      setState(prev => ({ ...prev, transcriptions: result }));
      
      toast({
        title: "Processing complete",
        description: "Audio has been successfully transcribed",
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process audio file",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isTranscribing: false }));
    }
  };

  const handleTimeUpdate = (time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
  };

  const handlePlayPause = (isPlaying: boolean) => {
    setState(prev => ({ ...prev, isPlaying }));
  };

  const handleReady = () => {
    setState(prev => ({ ...prev, isReady: true }));
  };

  const handleDurationChange = (duration: number) => {
    setState(prev => ({ ...prev, duration }));
  };

  if (!audioUrl) return null;

  return (
    <div className="space-y-4">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Audio Visualization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <WaveformVisualizer
            url={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onPlayPause={handlePlayPause}
            onReady={handleReady}
            onDurationChange={handleDurationChange}
          />
        </CardContent>
      </Card>

      <AudioProcessingControls
        {...state}
        onPlayPause={() => handlePlayPause(!state.isPlaying)}
      />

      <TranscriptionDisplay
        transcriptions={state.transcriptions}
        currentTime={state.currentTime}
        onTimeClick={(time) => handleTimeUpdate(time)}
      />
    </div>
  );
};