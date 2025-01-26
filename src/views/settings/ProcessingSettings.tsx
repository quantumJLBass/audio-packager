import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from './SettingsSection';
import type { AudioSettings } from '@/utils/settings';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProcessingSettingsProps {
  settings: AudioSettings;
  onChange: (settings: AudioSettings) => void;
}

export const ProcessingSettings: React.FC<ProcessingSettingsProps> = ({
  settings,
  onChange
}) => {
  return (
    <SettingsSection title="Processing Settings">
      <Accordion type="single" collapsible>
        <AccordionItem value="model">
          <AccordionTrigger>Model Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultModel">Default Model</Label>
                <Select
                  value={settings.defaultModel}
                  onValueChange={(value) => onChange({ ...settings, defaultModel: value })}
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
                <Label htmlFor="modelRevision">Model Revision</Label>
                <Input
                  id="modelRevision"
                  value={settings.modelRevision}
                  onChange={(e) => onChange({ ...settings, modelRevision: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableModelCaching"
                  checked={settings.enableModelCaching}
                  onCheckedChange={(checked) => onChange({ ...settings, enableModelCaching: checked })}
                />
                <Label htmlFor="enableModelCaching">Enable Model Caching</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="processing">
          <AccordionTrigger>Processing Options</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Select
                  value={settings.defaultLanguage}
                  onValueChange={(value) => onChange({ ...settings, defaultLanguage: value })}
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
                <Label htmlFor="defaultFloatingPoint">Floating Point Precision</Label>
                <Select
                  value={settings.defaultFloatingPoint.toString()}
                  onValueChange={(value) => onChange({ ...settings, defaultFloatingPoint: parseInt(value) })}
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
                  onChange={(e) => onChange({ ...settings, defaultChunkLength: parseInt(e.target.value) })}
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
                  onChange={(e) => onChange({ ...settings, defaultStrideLength: parseInt(e.target.value) })}
                  min={1}
                  max={30}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SettingsSection>
  );
};