import React, { useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Home } from 'lucide-react';
import { APISettings } from './settings/APISettings';
import { AudioSettings as AudioSettingsSection } from './settings/AudioSettings';
import { VisualizationSettings } from './settings/VisualizationSettings';
import { ProcessingSettings } from './settings/ProcessingSettings';
import { getSettings, saveSettings, type AudioSettings } from '@/utils/settings';
import { useToast } from '@/hooks/use-toast';

export const SettingsView = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AudioSettings>(getSettings());
  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveTimeRef = useRef<number>(Date.now());

  const handleSettingsChange = useCallback((newSettings: Partial<AudioSettings>) => {
    const now = Date.now();
    const timeSinceLastSave = now - lastSaveTimeRef.current;
    
    // Clear any pending short-term save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Update settings immediately in state
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    // If we've exceeded the long-term delay, save immediately
    if (timeSinceLastSave >= settings.autoSave.longTermDelay) {
      saveSettings(updatedSettings);
      lastSaveTimeRef.current = now;
      toast({
        title: "Settings saved",
        description: "Your changes have been saved",
        duration: 2000,
      });
    } else {
      // Schedule a save after the short-term delay
      saveTimeoutRef.current = setTimeout(() => {
        saveSettings(updatedSettings);
        lastSaveTimeRef.current = Date.now();
        toast({
          title: "Settings saved",
          description: "Your changes have been saved",
          duration: 2000,
        });
      }, settings.autoSave.shortTermDelay);
    }
  }, [settings, toast]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <Link to="/">
          <Button variant="outline" size="icon">
            <Home className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="api" className="w-full">
        <TabsList>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <APISettings settings={settings} onChange={handleSettingsChange} />
        </TabsContent>

        <TabsContent value="audio">
          <AudioSettingsSection settings={settings} onChange={handleSettingsChange} />
        </TabsContent>

        <TabsContent value="visualization">
          <VisualizationSettings settings={settings} onChange={handleSettingsChange} />
        </TabsContent>

        <TabsContent value="processing">
          <ProcessingSettings settings={settings} onChange={handleSettingsChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};