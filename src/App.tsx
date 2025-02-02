import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { SettingsView } from './views/SettingsView';
import { AudioUploadForm } from './components/audio/AudioUploadForm';
import { AudioProcessor } from './components/audio/AudioProcessor';
import { useSettings } from './hooks/useSettings';

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
    <Routes>
      <Route path="/" element={<Index />}>
        <Route index element={<div className="container mx-auto p-4">
          <AudioUploadForm onUpload={handleUpload} />
          {audioUrl && audioFile && (
            <AudioProcessor
              audioUrl={audioUrl}
              file={audioFile}
              settings={settings}
            />
          )}
        </div>} />
        <Route path="settings" element={<SettingsView />} />
      </Route>
    </Routes>
  );
}

export default App;