import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Settings {
  huggingFaceToken: string;
  openAIKey: string;
  defaultModel: string;
  defaultLanguage: string;
  defaultFloatingPoint: number;
  defaultChunkLength: number;
  defaultStrideLength: number;
}

export const SettingsView = () => {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<Settings>({
    huggingFaceToken: localStorage.getItem('huggingFaceToken') || '',
    openAIKey: localStorage.getItem('openAIKey') || '',
    defaultModel: localStorage.getItem('defaultModel') || 'whisper-large-v3',
    defaultLanguage: localStorage.getItem('defaultLanguage') || 'auto',
    defaultFloatingPoint: Number(localStorage.getItem('defaultFloatingPoint')) || 32,
    defaultChunkLength: Number(localStorage.getItem('defaultChunkLength')) || 30,
    defaultStrideLength: Number(localStorage.getItem('defaultStrideLength')) || 5,
  });

  const handleSave = () => {
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
    
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="huggingFaceToken">HuggingFace Token</Label>
            <Input
              id="huggingFaceToken"
              type="password"
              value={settings.huggingFaceToken}
              onChange={(e) => setSettings({ ...settings, huggingFaceToken: e.target.value })}
              placeholder="Enter your HuggingFace token"
            />
            <p className="text-sm text-muted-foreground">
              Get your token from the <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">HuggingFace settings page</a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openAIKey">OpenAI API Key</Label>
            <Input
              id="openAIKey"
              type="password"
              value={settings.openAIKey}
              onChange={(e) => setSettings({ ...settings, openAIKey: e.target.value })}
              placeholder="Enter your OpenAI API key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultModel">Default Model</Label>
            <Select
              value={settings.defaultModel}
              onValueChange={(value) => setSettings({ ...settings, defaultModel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whisper-large-v3">Whisper Large v3</SelectItem>
                <SelectItem value="whisper-medium">Whisper Medium</SelectItem>
                <SelectItem value="whisper-small">Whisper Small</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultLanguage">Default Language</Label>
            <Select
              value={settings.defaultLanguage}
              onValueChange={(value) => setSettings({ ...settings, defaultLanguage: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto Detect</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultFloatingPoint">Default Floating Point</Label>
            <Select
              value={settings.defaultFloatingPoint.toString()}
              onValueChange={(value) => setSettings({ ...settings, defaultFloatingPoint: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select precision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16">16-bit</SelectItem>
                <SelectItem value="32">32-bit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultChunkLength">Default Chunk Length (seconds)</Label>
            <Input
              id="defaultChunkLength"
              type="number"
              value={settings.defaultChunkLength}
              onChange={(e) => setSettings({ ...settings, defaultChunkLength: parseInt(e.target.value) })}
              min={1}
              max={60}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultStrideLength">Default Stride Length (seconds)</Label>
            <Input
              id="defaultStrideLength"
              type="number"
              value={settings.defaultStrideLength}
              onChange={(e) => setSettings({ ...settings, defaultStrideLength: parseInt(e.target.value) })}
              min={1}
              max={30}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};