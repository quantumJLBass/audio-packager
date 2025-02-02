import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { SettingsView } from "./views/SettingsView";
import { AudioUploadForm } from "./components/audio/AudioUploadForm";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Index />}>
                <Route index element={<AudioUploadForm onUpload={handleUpload} />} />
                <Route path="settings" element={<SettingsView />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;