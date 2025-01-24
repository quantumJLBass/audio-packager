import React, { useState, useCallback } from 'react';
import { AudioUploader } from '@/components/AudioUploader';
import { AudioProcessor } from '@/components/audio/AudioProcessor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error handling file:', error);
      toast({
        title: "Error",
        description: "Failed to process audio file. Please try again.",
        variant: "destructive",
      });
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

        {audioUrl && <AudioProcessor audioUrl={audioUrl} />}
      </main>
    </div>
  );
};

export default Index;