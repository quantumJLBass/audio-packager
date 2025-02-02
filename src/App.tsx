import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { SettingsView } from './views/SettingsView';

function App() {
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
