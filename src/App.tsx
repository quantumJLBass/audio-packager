import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AudioUploadForm } from './components/audio/AudioUploadForm';
import { AudioProcessor } from './components/audio/AudioProcessor';
import { useSettings } from './hooks/useSettings';
import { Button } from './components/ui/button';
import { Settings } from 'lucide-react';
import './App.css';

function App() {
  const { settings } = useSettings();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioFile(file);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Audio Processing Studio</h1>
        <Link to="/settings">
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      
      <AudioUploadForm onUpload={handleUpload} />
      {audioUrl && audioFile && (
        <AudioProcessor
          audioUrl={audioUrl}
          file={audioFile}
          settings={settings}
        />
      )}
    </div>
  );
}

export default App;