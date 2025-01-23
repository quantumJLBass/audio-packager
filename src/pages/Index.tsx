import React, { useState, useCallback } from 'react';
import { AudioWaveform } from '@/components/AudioWaveform';
import { AudioUploader } from '@/components/AudioUploader';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Transcription } from '@/types/audio';
import { pipeline } from '@huggingface/transformers';

const Index = () => {
  const { toast } = useToast();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const transcribeAudio = async (audioFile: File) => {
    try {
      setIsTranscribing(true);
      toast({
        title: "Transcribing",
        description: "Processing audio file. This may take a few moments...",
      });

      const transcriber = await pipeline(
        "automatic-speech-recognition",
        "onnx-community/whisper-tiny.en",
        { device: "webgpu" }
      );

      // Convert File to ArrayBuffer for processing
      const arrayBuffer = await audioFile.arrayBuffer();
      const result = await transcriber(arrayBuffer);
      
      if (!result || (!Array.isArray(result) && !result.text)) {
        throw new Error("Failed to transcribe audio");
      }

      const transcriptionText = Array.isArray(result) 
        ? result[0]?.text || ""
        : result.text || "";

      // Create a simple transcription segment
      const newTranscriptions: Transcription[] = [{
        text: transcriptionText,
        start: 0,
        end: 5,
        confidence: 0.95,
        speaker: { id: "1", name: "Speaker 1", color: "#4f46e5" }
      }];

      setTranscriptions(newTranscriptions);
      
      toast({
        title: "Success",
        description: "Audio transcription completed successfully",
      });
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Error",
        description: "Failed to transcribe audio. Please try again.",
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
      await transcribeAudio(file);
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
                  onTimeClick={handleTimeClick}
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