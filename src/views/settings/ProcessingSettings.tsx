import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from './SettingsSection';
import { SettingField } from '@/components/settings/SettingField';
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
              <SettingField
                id="defaultModel"
                label="Default Model"
                tooltip="Select the AI model to use for audio processing. Larger models are more accurate but slower."
              >
                <Select
                  value={settings.defaultModel}
                  onValueChange={(value) => onChange({ ...settings, defaultModel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {settings.supportedModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingField>

              <SettingField
                id="modelRevision"
                label="Model Revision"
                tooltip="The specific version of the model to use. Use 'main' for the latest version."
              >
                <Input
                  id="modelRevision"
                  value={settings.modelRevision}
                  onChange={(e) => onChange({ ...settings, modelRevision: e.target.value })}
                />
              </SettingField>

              <SettingField
                id="enableModelCaching"
                label="Enable Model Caching"
                tooltip="Cache model files locally to improve loading times on subsequent uses."
              >
                <Switch
                  id="enableModelCaching"
                  checked={settings.enableModelCaching}
                  onCheckedChange={(checked) => onChange({ ...settings, enableModelCaching: checked })}
                />
              </SettingField>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="processing">
          <AccordionTrigger>Processing Options</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <SettingField
                id="defaultLanguage"
                label="Default Language"
                tooltip="Select the primary language of the audio. Auto-detect works well for most cases."
              >
                <Select
                  value={settings.defaultLanguage}
                  onValueChange={(value) => onChange({ ...settings, defaultLanguage: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {settings.supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingField>

              <SettingField
                id="defaultFloatingPoint"
                label="Floating Point Precision"
                tooltip="Precision level for audio processing. Higher precision (32-bit) is more accurate but uses more memory."
              >
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
              </SettingField>

              <SettingField
                id="defaultChunkLength"
                label="Default Chunk Length (seconds)"
                tooltip="Length of audio segments for processing. Longer chunks are more accurate but use more memory."
              >
                <Input
                  id="defaultChunkLength"
                  type="number"
                  value={settings.defaultChunkLength}
                  onChange={(e) => onChange({ ...settings, defaultChunkLength: parseInt(e.target.value) })}
                  min={1}
                  max={60}
                />
              </SettingField>

              <SettingField
                id="defaultStrideLength"
                label="Default Stride Length (seconds)"
                tooltip="Overlap between audio chunks. Longer stride helps maintain context between chunks."
              >
                <Input
                  id="defaultStrideLength"
                  type="number"
                  value={settings.defaultStrideLength}
                  onChange={(e) => onChange({ ...settings, defaultStrideLength: parseInt(e.target.value) })}
                  min={1}
                  max={30}
                />
              </SettingField>

              <SettingField
                id="defaultConfidence"
                label="Default Confidence Threshold"
                tooltip="Minimum confidence score for transcription segments. Higher values mean more accurate but potentially fewer results."
              >
                <Input
                  id="defaultConfidence"
                  type="number"
                  value={settings.defaultConfidence}
                  onChange={(e) => onChange({ ...settings, defaultConfidence: parseFloat(e.target.value) })}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </SettingField>

              <SettingField
                id="noSpeechText"
                label="No Speech Text"
                tooltip="Text to display when no speech is detected in a segment."
              >
                <Input
                  id="noSpeechText"
                  value={settings.noSpeechText}
                  onChange={(e) => onChange({ ...settings, noSpeechText: e.target.value })}
                />
              </SettingField>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SettingsSection>
  );
};