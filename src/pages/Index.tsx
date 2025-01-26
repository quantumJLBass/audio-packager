import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AudioUploadForm } from '@/components/audio/AudioUploadForm';
import { AudioProcessor } from '@/components/audio/AudioProcessor';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const Index = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const location = useLocation();

  const handleFileSelect = async (file: File, options: any) => {
    try {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error handling file:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Audio Processing Studio</Link>
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </header>
      
      <main className="flex-1 container mx-auto p-4 space-y-6">
        {location.pathname === '/' ? (
          <>
            <AudioUploadForm onFileSelect={handleFileSelect} />
            {audioUrl && <AudioProcessor audioUrl={audioUrl} />}
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Index;