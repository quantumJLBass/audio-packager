import React from 'react';
import { Input } from '@/components/ui/input';
import { SettingField } from '@/components/settings/SettingField';
import type { AudioSettings } from '@/types/audio/settings';

interface SpeakerSettingsProps {
  settings: AudioSettings;
  onChange: (settings: Partial<AudioSettings>) => void;
}

export const SpeakerSettings: React.FC<SpeakerSettingsProps> = ({
  settings,
  onChange
}) => {
  const validateTemplate = (value: string) => {
    return value.includes('{?}');
  };

  const handleTemplateChange = (
    field: 'speakerIdTemplate' | 'speakerNameTemplate',
    value: string
  ) => {
    if (validateTemplate(value)) {
      onChange({ [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <SettingField
        id="speakerIdTemplate"
        label="Speaker ID Template"
        tooltip="Template for generating speaker IDs. Must contain {?} which will be replaced with a unique identifier."
      >
        <Input
          value={settings.speakerIdTemplate}
          onChange={(e) => handleTemplateChange('speakerIdTemplate', e.target.value)}
          placeholder="speaker-{?}"
        />
        {!validateTemplate(settings.speakerIdTemplate) && (
          <p className="text-sm text-destructive mt-1">
            Template must contain {'{?}'} placeholder
          </p>
        )}
      </SettingField>

      <SettingField
        id="speakerNameTemplate"
        label="Speaker Name Template"
        tooltip="Template for generating speaker names. Must contain {?} which will be replaced with a number."
      >
        <Input
          value={settings.speakerNameTemplate}
          onChange={(e) => handleTemplateChange('speakerNameTemplate', e.target.value)}
          placeholder="Speaker {?}"
        />
        {!validateTemplate(settings.speakerNameTemplate) && (
          <p className="text-sm text-destructive mt-1">
            Template must contain {'{?}'} placeholder
          </p>
        )}
      </SettingField>

      <SettingField
        id="maxSpeakers"
        label="Maximum Speakers"
        tooltip="Maximum number of unique speakers that can be detected"
      >
        <Input
          type="number"
          min={1}
          max={20}
          value={settings.maxSpeakers}
          onChange={(e) => onChange({ maxSpeakers: Number(e.target.value) })}
        />
      </SettingField>
    </div>
  );
};