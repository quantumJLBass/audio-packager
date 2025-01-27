import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WaveformVisualizer } from './WaveformVisualizer';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { useToast } from '@/hooks/use-toast';
import { Transcription, AudioProcessingState } from '@/types/audio';
import { processAudioBuffer, transcribeAudio } from '@/utils/audioProcessing';
import { AudioProcessingControls } from './AudioProcessingControls';
import { AudioSettings } from '@/utils/settings';

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
  });

  const [speakers] = useState(() => 
    Array.from({ length: settings.maxSpeakers }, (_, i) => ({
      id: settings.speakerIdTemplate.replace('{idx}', String(i + 1)),
      name: settings.speakerNameTemplate.replace('{idx}', String(i + 1)),
      color: settings.speakerColors[i % settings.speakerColors.length],
    }))
  );

  useEffect(() => {
    if (audioUrl) {
      processAudio();
    }
    
    return () => {
      if (audioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const processAudio = async () => {
    if (!audioUrl) return;

    try {
      setState(prev => ({ ...prev, isTranscribing: true }));
      
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioData = await processAudioBuffer(arrayBuffer);
      const result = await transcribeAudio(audioData, settings);
      
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
            settings={settings}
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
        settings={settings}
      />
    </div>
  );
};