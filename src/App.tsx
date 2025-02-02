import React, { useState } from 'react';
import { AudioUploadForm } from './components/audio/AudioUploadForm';
import { AudioProcessor } from './components/audio/AudioProcessor';
import { useSettings } from './hooks/useSettings';
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