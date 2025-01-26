import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SettingsSection } from './SettingsSection';
import type { AudioSettings } from '@/utils/settings';

interface APISettingsProps {
  settings: AudioSettings;
  onChange: (settings: AudioSettings) => void;
}

export const APISettings: React.FC<APISettingsProps> = ({
  settings,
  onChange
}) => {
  return (
    <SettingsSection title="API Settings">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="huggingFaceToken">HuggingFace Token</Label>
          <Input
            id="huggingFaceToken"
            type="password"
            value={settings.huggingFaceToken}
            onChange={(e) => onChange({ ...settings, huggingFaceToken: e.target.value })}
            placeholder="Enter your HuggingFace token"
          />
          <p className="text-sm text-muted-foreground">
            Get your token from the <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">HuggingFace settings page</a>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="openAIKey">OpenAI API Key</Label>
          <Input
            id="openAIKey"
            type="password"
            value={settings.openAIKey}
            onChange={(e) => onChange({ ...settings, openAIKey: e.target.value })}
            placeholder="Enter your OpenAI API key"
          />
          <p className="text-sm text-muted-foreground">
            Get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI dashboard</a>
          </p>
        </div>
      </div>
    </SettingsSection>
  );
};