import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WaveformVisualizer } from './WaveformVisualizer';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { useToast } from '@/hooks/use-toast';
import { Transcription, AudioProcessingState, AudioProcessingOptions } from '@/types/audio';
import { processAudioBuffer, transcribeAudio } from '@/utils/audioProcessing';
import { AudioProcessingControls } from './AudioProcessingControls';

interface AudioProcessorProps {
  audioUrl: string | null;
  options?: AudioProcessingOptions;
}

export const AudioProcessor: React.FC<AudioProcessorProps> = ({ audioUrl, options }) => {
  const { toast } = useToast();
  const [state, setState] = useState<AudioProcessingState>({
    currentTime: 0,
    isPlaying: false,
    duration: 0,
    isReady: false,
    isTranscribing: false,
    transcriptions: [],
  });

  const [speakers] = useState([
    { id: '1', name: 'Speaker 1', color: '#4f46e5' },
    { id: '2', name: 'Speaker 2', color: '#7c3aed' },
  ]);

  useEffect(() => {
    if (audioUrl) {
      processAudio();
    }
  }, [audioUrl, options]);

  const processAudio = async () => {
    if (!audioUrl) return;

    try {
      setState(prev => ({ ...prev, isTranscribing: true }));
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioData = await processAudioBuffer(arrayBuffer);
      
      if (options) {
        const result = await transcribeAudio(audioData, options);
        setState(prev => ({ ...prev, transcriptions: result }));
      }

      toast({
        title: "Processing complete",
        description: "Audio has been successfully transcribed",
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error",
        description: "Failed to process audio file. Please check your settings.",
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
            speakers={speakers}
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