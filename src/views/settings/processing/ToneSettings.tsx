import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingField } from '@/components/settings/SettingField';
import type { AudioSettings } from '@/types/audio/settings';

interface ToneSettingsProps {
  settings: AudioSettings;
  onChange: (settings: Partial<AudioSettings>) => void;
}

export const ToneSettings: React.FC<ToneSettingsProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-4">
      <SettingField
        id="defaultTone"
        label="Default Tone"
        tooltip="Select the default tone for analysis"
      >
        <Select
          value={settings.toneAnalysis.defaultTone}
          onValueChange={(value) => onChange({
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
  );
};
