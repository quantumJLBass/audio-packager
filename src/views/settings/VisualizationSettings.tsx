import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SettingsSection } from './SettingsSection';
import type { AudioSettings } from '@/utils/settings';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface VisualizationSettingsProps {
  settings: AudioSettings;
  onChange: (settings: AudioSettings) => void;
}

export const VisualizationSettings: React.FC<VisualizationSettingsProps> = ({
  settings,
  onChange
}) => {
  return (
    <SettingsSection title="Visualization Settings">
      <Accordion type="single" collapsible>
        <AccordionItem value="colors">
          <AccordionTrigger>Color Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Speaker Colors</Label>
                <div className="grid grid-cols-4 gap-2">
                  {settings.speakerColors.map((color, index) => (
                    <Input
                      key={index}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...settings.speakerColors];
                        newColors[index] = e.target.value;
                        onChange({ ...settings, speakerColors: newColors });
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Waveform Colors</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.waveformColors).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`waveform-${key}`}>{key}</Label>
                      <Input
                        id={`waveform-${key}`}
                        type="color"
                        value={value}
                        onChange={(e) => onChange({
                          ...settings,
                          waveformColors: {
                            ...settings.waveformColors,
                            [key]: e.target.value
                          }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="zoom">
          <AccordionTrigger>Zoom Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minZoom">Minimum Zoom (%)</Label>
                <Input
                  id="minZoom"
                  type="number"
                  value={settings.minZoom}
                  onChange={(e) => onChange({ ...settings, minZoom: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxZoom">Maximum Zoom (%)</Label>
                <Input
                  id="maxZoom"
                  type="number"
                  value={settings.maxZoom}
                  onChange={(e) => onChange({ ...settings, maxZoom: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultZoom">Default Zoom (%)</Label>
                <Input
                  id="defaultZoom"
                  type="number"
                  value={settings.defaultZoom}
                  onChange={(e) => onChange({ ...settings, defaultZoom: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zoomStep">Zoom Step (%)</Label>
                <Input
                  id="zoomStep"
                  type="number"
                  value={settings.zoomStep}
                  onChange={(e) => onChange({ ...settings, zoomStep: Number(e.target.value) })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="time">
          <AccordionTrigger>Time Display Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <Input
                  id="timeFormat"
                  value={settings.timeFormat}
                  onChange={(e) => onChange({ ...settings, timeFormat: e.target.value })}
                  placeholder="HH:mm:ss"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showMilliseconds"
                  checked={settings.showMilliseconds}
                  onCheckedChange={(checked) => onChange({ ...settings, showMilliseconds: checked })}
                />
                <Label htmlFor="showMilliseconds">Show Milliseconds</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SettingsSection>
  );
};