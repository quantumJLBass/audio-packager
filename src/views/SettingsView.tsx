import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getSettings, saveSettings, type AudioSettings } from '@/utils/settings';
import { SettingsSection } from './settings/SettingsSection';
import { APISettings } from './settings/APISettings';
import { AudioSettings as AudioSettingsSection } from './settings/AudioSettings';
import { VisualizationSettings } from './settings/VisualizationSettings';
import { ProcessingSettings } from './settings/ProcessingSettings';

export const SettingsView = () => {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<AudioSettings>(getSettings());

  const handleSave = () => {
    const updatedSettings = saveSettings(settings);
    setSettings(updatedSettings);
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully",
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Tabs defaultValue="api" className="w-full">
        <TabsList>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <APISettings settings={settings} onChange={setSettings} />
        </TabsContent>

        <TabsContent value="audio">
          <AudioSettingsSection settings={settings} onChange={setSettings} />
        </TabsContent>

        <TabsContent value="visualization">
          <VisualizationSettings settings={settings} onChange={setSettings} />
        </TabsContent>

        <TabsContent value="processing">
          <ProcessingSettings settings={settings} onChange={setSettings} />
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="w-full">
        Save All Settings
      </Button>
    </div>
  );
};