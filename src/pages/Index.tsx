import React, { useState, useCallback } from 'react';
import { AudioWaveform } from '@/components/AudioWaveform';
import { AudioUploader } from '@/components/AudioUploader';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Transcription } from '@/types/audio';

const Index = () => {
  const { toast } = useToast();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);

  const handleFileSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    
    // Simulate transcription for now - in reality, this would call your AI service
    setTranscriptions([
      {
        text: "This is a sample transcription.",
        start: 0,
        end: 5,
        confidence: 0.95,
        speaker: { id: "1", name: "Speaker 1", color: "#4f46e5" }
      },
      {
        text: "We'll replace this with real transcriptions later.",
        start: 5,
        end: 10,
        confidence: 0.92,
        speaker: { id: "2", name: "Speaker 2", color: "#7c3aed" }
      }
    ]);
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
                  height={120}
                  waveColor="#4f46e5"
                  progressColor="#7c3aed"
                />
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Transcription</CardTitle>
              </CardHeader>
              <CardContent>
                <TranscriptionDisplay
                  transcriptions={transcriptions}
                  currentTime={currentTime}
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