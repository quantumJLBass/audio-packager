import { useState, useCallback } from 'react';
import type { AudioSettings } from '@/types/audio/settings';
import { getSettings, saveSettings } from '@/utils/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<AudioSettings>(getSettings());

  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    const updated = saveSettings(newSettings);
    setSettings(updated);
    return updated;
  }, []);

  return {
    settings,
    updateSettings
  };
};