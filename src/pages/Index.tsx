import React, { useState, useCallback } from 'react';
import { AudioWaveform } from '@/components/AudioWaveform';
import { AudioUploader } from '@/components/AudioUploader';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Transcription, Speaker } from '@/types/audio';
import { processAudioBuffer, transcribeAudio } from '@/utils/audioProcessing';

const Index = () => {
  const { toast } = useToast();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleTranscription = async (audioFile: File) => {
    try {
      setIsTranscribing(true);
      toast({
        title: "Transcribing",
        description: "Processing audio file. This may take a few moments...",
      });

      const arrayBuffer = await audioFile.arrayBuffer();
      const float32Array = await processAudioBuffer(arrayBuffer);
      const result = await transcribeAudio(float32Array);

      if (!result) {
        throw new Error("Failed to transcribe audio");
      }

      // Handle both single and array results
      const segments = Array.isArray(result) ? result : [result];
      
      const newTranscriptions: Transcription[] = segments.map((segment, index) => {
        const timestamps = segment.chunks?.[0]?.timestamp || [0, 0];
        return {
          text: segment.text || "(no speech detected)",
          start: timestamps[0],
          end: timestamps[1],
          confidence: 0.95,
          speaker: { id: "1", name: "Speaker 1", color: "#4f46e5" }
        };
      });

      setTranscriptions(newTranscriptions);
      
      toast({
        title: "Success",
        description: "Audio transcription completed successfully",
      });
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to transcribe audio",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      await handleTranscription(file);
    } catch (error) {
      console.error('Error handling file:', error);
      toast({
        title: "Error",
        description: "Failed to process audio file. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const handleTranscriptionUpdate = useCallback((updatedTranscription: Transcription) => {
    setTranscriptions(prev => 
      prev.map(t => 
        t.start === updatedTranscription.start ? updatedTranscription : t
      )
    );
  }, []);

  const handleTranscriptionSplit = useCallback((transcript: Transcription, splitTime: number) => {
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
  }, []);

  const handleTranscriptionAdd = useCallback((time: number, position: 'before' | 'after') => {
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
  }, []);

  const handleTranscriptionDelete = useCallback((transcript: Transcription) => {
    setTranscriptions(prev => prev.filter(t => t.start !== transcript.start));
  }, []);

  const handleSpeakerUpdate = useCallback((speakerId: string, newName: string, updateAll: boolean) => {
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
  }, []);

  const handleTimeClick = useCallback((time: number) => {
    const wavesurfer = document.querySelector('wave') as any;
    if (wavesurfer) {
      wavesurfer.seekTo(time / wavesurfer.getDuration());
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass p-4">
        <h1 className="text-2xl font-bold">Audio Processing Studio</h1>
      </header>
      
      <main className="flex-1 container mx-auto p-4 space-y-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Upload Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <AudioUploader onFileSelect={handleFileSelect} />
          </CardContent>
        </Card>

        {audioUrl && (
          <>
            <Card className="glass">
              <CardHeader>
                <CardTitle>Audio Waveform</CardTitle>
              </CardHeader>
              <CardContent>
                <AudioWaveform
                  url={audioUrl}
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
        )}
      </main>
    </div>
  );
};

export default Index;