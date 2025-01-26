import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, HelpCircle, Eye, EyeOff } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { APISettings } from './settings/APISettings';
import { AudioSettings as AudioSettingsSection } from './settings/AudioSettings';
import { VisualizationSettings } from './settings/VisualizationSettings';
import { ProcessingSettings } from './settings/ProcessingSettings';

export const SettingsView = () => {
  const navigate = useNavigate();

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
          <APISettings />
        </TabsContent>

        <TabsContent value="audio">
          <AudioSettingsSection />
        </TabsContent>

        <TabsContent value="visualization">
          <VisualizationSettings />
        </TabsContent>

        <TabsContent value="processing">
          <ProcessingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};