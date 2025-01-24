import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioWaveform } from '@/components/AudioWaveform';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { useToast } from '@/hooks/use-toast';
import { Transcription } from '@/types/audio';
import { processAudioBuffer, transcribeAudio } from '@/utils/audioProcessing';

interface AudioProcessorProps {
  audioUrl: string | null;
}

export const AudioProcessor: React.FC<AudioProcessorProps> = ({ audioUrl }) => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(0);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleTranscriptionUpdate = (updatedTranscription: Transcription) => {
    setTranscriptions(prev => 
      prev.map(t => 
        t.start === updatedTranscription.start ? updatedTranscription : t
      )
    );
  };

  const handleTranscriptionSplit = (transcript: Transcription, splitTime: number) => {
    setTranscriptions(prev => {
      const index = prev.findIndex(t => t.start === transcript.start);
      if (index === -1) return prev;

      const firstHalf: Transcription = {
        ...transcript,
        end: splitTime
      };

      const secondHalf: Transcription = {
        ...transcript,
        start: splitTime,
        text: transcript.text
      };

      const newTranscriptions = [...prev];
      newTranscriptions.splice(index, 1, firstHalf, secondHalf);
      return newTranscriptions;
    });
  };

  const handleTranscriptionAdd = (time: number, position: 'before' | 'after') => {
    setTranscriptions(prev => {
      const newTranscription: Transcription = {
        text: "(new entry)",
        start: time,
        end: time + 5,
        confidence: 0.95,
        speaker: { id: "1", name: "Speaker 1", color: "#4f46e5" }
      };

      const index = prev.findIndex(t => t.start > time);
      const newTranscriptions = [...prev];
      
      if (position === 'before') {
        newTranscriptions.splice(Math.max(0, index - 1), 0, newTranscription);
      } else {
        newTranscriptions.splice(index === -1 ? newTranscriptions.length : index, 0, newTranscription);
      }
      
      return newTranscriptions;
    });
  };

  const handleTranscriptionDelete = (transcript: Transcription) => {
    setTranscriptions(prev => prev.filter(t => t.start !== transcript.start));
  };

  const handleSpeakerUpdate = (speakerId: string, newName: string, updateAll: boolean) => {
    setTranscriptions(prev => 
      prev.map(t => {
        if (!t.speaker) return t;
        if (updateAll && t.speaker.name === speakerId) {
          return {
            ...t,
            speaker: { ...t.speaker, name: newName }
          };
        } else if (!updateAll && t.speaker.id === speakerId) {
          return {
            ...t,
            speaker: { ...t.speaker, name: newName }
          };
        }
        return t;
      })
    );
  };

  const handleTimeClick = (time: number) => {
    const wavesurfer = document.querySelector('wave') as any;
    if (wavesurfer) {
      wavesurfer.seekTo(time / wavesurfer.getDuration());
    }
  };

  return (
    <>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Audio Waveform</CardTitle>
        </CardHeader>
        <CardContent>
          <AudioWaveform
            url={audioUrl!}
            onTimeUpdate={setCurrentTime}
            onSeek={setCurrentTime}
            height={120}
            waveColor="#4f46e5"
            progressColor="#7c3aed"
          />
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>
            Transcription
            {isTranscribing && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Processing...)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TranscriptionDisplay
            transcriptions={transcriptions}
            currentTime={currentTime}
            onTranscriptionUpdate={handleTranscriptionUpdate}
            onTranscriptionSplit={handleTranscriptionSplit}
            onTranscriptionAdd={handleTranscriptionAdd}
            onTranscriptionDelete={handleTranscriptionDelete}
            onTimeClick={handleTimeClick}
            onSpeakerUpdate={handleSpeakerUpdate}
          />
        </CardContent>
      </Card>
    </>
  );
};