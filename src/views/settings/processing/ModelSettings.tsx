import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SettingField } from '@/components/settings/SettingField';
import type { AudioSettings } from '@/types/audio/settings';
import type { DeviceType, DType } from '@/types/audio/common';
import { DeviceTypes, DTypes } from '@/types/audio/common';

interface ModelSettingsProps {
  settings: AudioSettings;
  onChange: (settings: Partial<AudioSettings>) => void;
}

export const ModelSettings: React.FC<ModelSettingsProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-4">
      <SettingField
        id="model"
        label="Model"
        tooltip="Select the AI model to use for audio processing"
      >
        <Select
          value={(settings.defaultModel ?? 1).toString()}
          onValueChange={(value) => onChange({ defaultModel: parseInt(value, 10) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {settings.supportedModels.map((model) => (
              <SelectItem key={model.id} value={model.id.toString()}>
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
            modelConfig: { ...settings.modelConfig, device: value }
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select device" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DeviceTypes).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {key}
              </SelectItem>
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
            modelConfig: { ...settings.modelConfig, dtype: value }
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DTypes).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingField>
    </div>
  );
};