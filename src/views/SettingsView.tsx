import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';
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

  const handleSettingsChange = (newSettings: Partial<AudioSettings>) => {
    const updatedSettings = saveSettings(newSettings);
    setSettings(updatedSettings);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
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