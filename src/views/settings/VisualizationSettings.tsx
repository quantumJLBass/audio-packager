import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SettingsSection } from './SettingsSection';
import { SettingField } from '@/components/settings/SettingField';
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
              <SettingField
                id="speaker-colors"
                label="Speaker Colors"
                tooltip="Colors used to distinguish different speakers in the transcription"
              >
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
              </SettingField>

              <SettingField
                id="waveform-colors"
                label="Waveform Colors"
                tooltip="Colors used in the audio waveform visualization"
              >
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.waveformColors).map(([key, value]) => (
                    <SettingField
                      key={key}
                      id={`waveform-${key}`}
                      label={key}
                      tooltip={`Color for the ${key} element of the waveform`}
                    >
                      <Input
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
                    </SettingField>
                  ))}
                </div>
              </SettingField>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="zoom">
          <AccordionTrigger>Zoom Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <SettingField
                id="minZoom"
                label="Minimum Zoom (%)"
                tooltip="The smallest allowed zoom level for the waveform view"
              >
                <Input
                  type="number"
                  value={settings.minZoom}
                  onChange={(e) => onChange({ ...settings, minZoom: Number(e.target.value) })}
                />
              </SettingField>

              <SettingField
                id="maxZoom"
                label="Maximum Zoom (%)"
                tooltip="The largest allowed zoom level for the waveform view"
              >
                <Input
                  type="number"
                  value={settings.maxZoom}
                  onChange={(e) => onChange({ ...settings, maxZoom: Number(e.target.value) })}
                />
              </SettingField>

              <SettingField
                id="defaultZoom"
                label="Default Zoom (%)"
                tooltip="The initial zoom level when loading the waveform"
              >
                <Input
                  type="number"
                  value={settings.defaultZoom}
                  onChange={(e) => onChange({ ...settings, defaultZoom: Number(e.target.value) })}
                />
              </SettingField>

              <SettingField
                id="zoomStep"
                label="Zoom Step (%)"
                tooltip="How much the zoom changes with each zoom in/out action"
              >
                <Input
                  type="number"
                  value={settings.zoomStep}
                  onChange={(e) => onChange({ ...settings, zoomStep: Number(e.target.value) })}
                />
              </SettingField>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="time">
          <AccordionTrigger>Time Display Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <SettingField
                id="timeFormat"
                label="Time Format"
                tooltip="Format string for displaying timestamps (e.g., HH:mm:ss)"
              >
                <Input
                  value={settings.timeFormat}
                  onChange={(e) => onChange({ ...settings, timeFormat: e.target.value })}
                  placeholder="HH:mm:ss"
                />
              </SettingField>

              <SettingField
                id="showMilliseconds"
                label="Show Milliseconds"
                tooltip="Whether to display milliseconds in timestamps"
              >
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.showMilliseconds}
                    onCheckedChange={(checked) => onChange({ ...settings, showMilliseconds: checked })}
                  />
                </div>
              </SettingField>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SettingsSection>
  );
};