import { SentimentThresholdMatrix } from '@/components/settings/SentimentThresholdMatrix';
import { SettingField } from '@/components/settings/SettingField';
import { Input } from '@/components/ui/input';
import type { AudioSettings } from '@/types/audio/settings';
import React from 'react';

interface SentimentSettingsProps {
  settings: AudioSettings;
  onChange: (settings: Partial<AudioSettings>) => void;
}

export const SentimentSettings: React.FC<SentimentSettingsProps> = ({ settings, onChange }) => {
  return (
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
  );
};
