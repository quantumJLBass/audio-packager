import { useState, useEffect } from 'react';
import { AudioSettings } from '@/types/audio/settings';
import { getSettings, saveSettings } from '@/utils/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<AudioSettings>(getSettings());

  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    const updated = saveSettings(newSettings);
    setSettings(updated);
  };

  return { settings, updateSettings };
};