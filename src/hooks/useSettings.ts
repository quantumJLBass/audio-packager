import { useState, useCallback } from 'react';
import { getSettings, saveSettings } from '@/utils/settings';
import type { AudioSettings } from '@/types/audio/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<AudioSettings>(getSettings());

  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    const updatedSettings = saveSettings(newSettings);
    setSettings(updatedSettings);
  }, []);

  return {
    settings,
    updateSettings
  };
};