import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from './SettingsSection';
import { SettingField } from '@/components/settings/SettingField';
import { SentimentThresholdMatrix } from '@/components/settings/SentimentThresholdMatrix';
import { SpeakerSettings } from '@/views/settings/SpeakerSettings';
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
  onChange: (settings: Partial<AudioSettings>) => void;
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
                id="model"
                label="Model"
                tooltip="Select the AI model to use for audio processing"
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
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingField>

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
                    sentimentAnalysis: {
                      ...settings.sentimentAnalysis,
                      model: e.target.value
                    }
                  })}
                />
              </SettingField>

              <SettingField
                id="sentimentThresholds"
                label="Sentiment Thresholds"
                tooltip="Configure thresholds and metrics for emotion detection"
              >
                <SentimentThresholdMatrix
                  thresholds={settings.sentimentAnalysis.thresholds}
                  onChange={(thresholds) => onChange({
                    sentimentAnalysis: {
                      ...settings.sentimentAnalysis,
                      thresholds
                    }
                  })}
                />
              </SettingField>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tone">
          <AccordionTrigger>Tone Analysis</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <SettingField
                id="defaultTone"
                label="Default Tone"
                tooltip="Select the default tone for analysis"
              >
                <Select
                  value={settings.toneAnalysis.defaultTone}
                  onValueChange={(value) => onChange({
                    ...settings,
                    toneAnalysis: {
                      ...settings.toneAnalysis,
                      defaultTone: value
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(settings.toneAnalysis.toneThresholds).map((tone) => (
                      <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingField>

              <SettingField
                id="toneThresholds"
                label="Tone Thresholds"
                tooltip="Set thresholds for different tones"
              >
                <div className="space-y-2">
                  {Object.entries(settings.toneAnalysis.toneThresholds).map(([tone, threshold]) => (
                    <div key={tone} className="flex items-center space-x-2">
                      <Label>{tone}</Label>
                      <Input
                        type="number"
                        value={threshold}
                        onChange={(e) => {
                          const newThresholds = {
                            ...settings.toneAnalysis.toneThresholds,
                            [tone]: parseFloat(e.target.value)
                          };
                          onChange({
                            ...settings,
                            toneAnalysis: {
                              ...settings.toneAnalysis,
                              toneThresholds: newThresholds
                            }
                          });
                        }}
                        step="0.1"
                        min="0"
                        max="1"
                      />
                    </div>
                  ))}
                </div>
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
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="speakers">
          <AccordionTrigger>Speaker Settings</AccordionTrigger>
          <AccordionContent>
            <SpeakerSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SettingsSection>
  );
};