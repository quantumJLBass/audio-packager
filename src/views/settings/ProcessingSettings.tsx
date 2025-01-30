import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from './SettingsSection';
import { SettingField } from '@/components/settings/SettingField';
import type { AudioSettings } from '@/types/audio/settings';
import { DeviceType, DType } from '@/types/audio/processing';
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

/**
 * Component for managing audio processing settings
 * Handles model configuration, sentiment analysis, and processing options
 */
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
                id="useOnnx"
                label="Use ONNX Model"
                tooltip="Enable ONNX model optimization for better performance"
              >
                <Switch
                  checked={settings.modelConfig.useOnnx}
                  onCheckedChange={(checked) => onChange({
                    ...settings,
                    modelConfig: { ...settings.modelConfig, useOnnx: checked }
                  })}
                />
              </SettingField>

              <SettingField
                id="useQuantized"
                label="Use Quantized Model"
                tooltip="Enable quantized model for reduced memory usage"
              >
                <Switch
                  checked={settings.modelConfig.useQuantized}
                  onCheckedChange={(checked) => onChange({
                    ...settings,
                    modelConfig: { ...settings.modelConfig, useQuantized: checked }
                  })}
                />
              </SettingField>

              <SettingField
                id="device"
                label="Processing Device"
                tooltip="Select the device to use for model processing"
              >
                <Select
                  value={settings.modelConfig.device}
                  onValueChange={(value: DeviceType) => onChange({
                    ...settings,
                    modelConfig: { ...settings.modelConfig, device: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DeviceType).map((device) => (
                      <SelectItem key={device} value={device}>{device}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingField>

              <SettingField
                id="dtype"
                label="Data Type"
                tooltip="Select the floating-point precision for model computations"
              >
                <Select
                  value={settings.modelConfig.dtype}
                  onValueChange={(value: DType) => onChange({
                    ...settings,
                    modelConfig: { ...settings.modelConfig, dtype: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DType).map((dtype) => (
                      <SelectItem key={dtype} value={dtype}>{dtype}</SelectItem>
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

        <AccordionItem value="sentiment">
          <AccordionTrigger>Sentiment Analysis</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <SettingField
                id="sentimentProvider"
                label="Provider"
                tooltip="Select the sentiment analysis model provider"
              >
                <Input
                  value={settings.sentimentAnalysis.provider}
                  onChange={(e) => onChange({
                    ...settings,
                    sentimentAnalysis: {
                      ...settings.sentimentAnalysis,
                      provider: e.target.value
                    }
                  })}
                />
              </SettingField>

              <SettingField
                id="sentimentModel"
                label="Model"
                tooltip="Select the sentiment analysis model"
              >
                <Input
                  value={settings.sentimentAnalysis.model}
                  onChange={(e) => onChange({
                    ...settings,
                    sentimentAnalysis: {
                      ...settings.sentimentAnalysis,
                      model: e.target.value
                    }
                  })}
                />
              </SettingField>

              <SettingField
                id="defaultLabel"
                label="Default Label"
                tooltip="Default sentiment label when analysis fails"
              >
                <Input
                  value={settings.sentimentAnalysis.defaultLabel}
                  onChange={(e) => onChange({
                    ...settings,
                    sentimentAnalysis: {
                      ...settings.sentimentAnalysis,
                      defaultLabel: e.target.value
                    }
                  })}
                />
              </SettingField>

              <SettingField
                id="sentimentThresholds"
                label="Thresholds"
                tooltip="Set thresholds for different emotions"
              >
                {/* Add UI for thresholds settings here */}
                {/* This part can be expanded based on the specific requirements for thresholds */}
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
                tooltip="Select the primary language of the audio"
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