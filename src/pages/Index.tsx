import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AudioUploadForm } from '@/components/audio/AudioUploadForm';
import { AudioProcessor } from '@/components/audio/AudioProcessor';
import { SettingsView } from '@/views/SettingsView';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleFileSelect = async (file: File, options: any) => {
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audio Processing Studio</h1>
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </header>
      
      <main className="flex-1 container mx-auto p-4 space-y-6">
        <Routes>
          <Route path="/" element={
            <>
              <AudioUploadForm onFileSelect={handleFileSelect} />
              {audioUrl && <AudioProcessor audioUrl={audioUrl} />}
            </>
          } />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </main>
    </div>
  );
};

export default Index;