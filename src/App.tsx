import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import { SettingsView } from '@/views/SettingsView';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-container">
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/settings" element={<SettingsView />} />
            </Routes>
          </div>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;