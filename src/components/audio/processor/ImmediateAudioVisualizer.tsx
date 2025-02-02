import React, { useEffect, useState } from 'react';
import { AudioWaveform } from '@/components/AudioWaveform';
import { AudioSettings } from '@/types/audio/settings';
import { useToast } from '@/hooks/use-toast';
import { transcribeAudio } from '@/utils/audio/processing';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { Transcription } from '@/types/audio/transcription';

interface ImmediateAudioVisualizerProps {
  url: string;
  settings: AudioSettings;
  onTimeUpdate: (time: number) => void;
  onPlayPause: (isPlaying: boolean) => void;
  onReady: () => void;
  onDurationChange: (duration: number) => void;
}

export const ImmediateAudioVisualizer: React.FC<ImmediateAudioVisualizerProps> = ({
  url,
  settings,
  onTimeUpdate,
  onPlayPause,
  onReady,
  onDurationChange,
}) => {
  const { toast } = useToast();
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    const startTranscription = async () => {
      if (!url) return;
      
      setIsTranscribing(true);
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioData = new Float32Array(arrayBuffer);
        
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
      } finally {
        setIsTranscribing(false);
      }
    };

    startTranscription();
  }, [url, toast]);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    onTimeUpdate(time);
  };

  const handleSeek = (time: number) => {
    onTimeUpdate(time);
  };

  return (
    <div className="space-y-4">
      <AudioWaveform
        url={url}
        onReady={onReady}
        onTimeUpdate={handleTimeUpdate}
        onSeek={handleSeek}
        height={settings.waveformHeight}
        waveColor={settings.waveformColors.waveform}
        progressColor={settings.waveformColors.progress}
      />
      
      {isTranscribing && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">Transcribing audio...</span>
        </div>
      )}
      
      {transcriptions.length > 0 && (
        <TranscriptionDisplay
          transcriptions={transcriptions}
          currentTime={currentTime}
          onTimeClick={handleSeek}
        />
      )}
    </div>
  );
};