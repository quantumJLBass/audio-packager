import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { SettingField } from '@/components/settings/SettingField';
import type { AudioSettings } from '@/utils/settings';

interface APISettingsProps {
  settings: AudioSettings;
  onChange: (settings: Partial<AudioSettings>) => void;
}

export const APISettings: React.FC<APISettingsProps> = ({
  settings,
  onChange
}) => {
  const [showHuggingFaceToken, setShowHuggingFaceToken] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);

  return (
    <SettingsSection title="API Settings">
      <div className="space-y-4">
        <SettingField
          id="huggingFaceToken"
          label="HuggingFace Token"
          tooltip="Required for audio transcription using Whisper models"
        >
          <div className="flex space-x-2">
            <Input
              id="huggingFaceToken"
              type={showHuggingFaceToken ? "text" : "password"}
              value={settings.huggingFaceToken}
              onChange={(e) => onChange({ ...settings, huggingFaceToken: e.target.value })}
              placeholder="Enter your HuggingFace token"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHuggingFaceToken(!showHuggingFaceToken)}
            >
              {showHuggingFaceToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Get your token from the <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">HuggingFace settings page</a>
          </p>
        </SettingField>

        <SettingField
          id="openAIKey"
          label="OpenAI API Key"
          tooltip="Required for advanced language processing features"
        >
          <div className="flex space-x-2">
            <Input
              id="openAIKey"
              type={showOpenAIKey ? "text" : "password"}
              value={settings.openAIKey}
              onChange={(e) => onChange({ ...settings, openAIKey: e.target.value })}
              placeholder="Enter your OpenAI API key"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowOpenAIKey(!showOpenAIKey)}
            >
              {showOpenAIKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI dashboard</a>
          </p>
        </SettingField>
      </div>
    </SettingsSection>
  );
};