import type { AudioSettings } from '@/types/audio/settings';
import { defaultSettings } from './settings';

export const migrateSettings = (oldSettings: Partial<AudioSettings>, currentVersion: string): AudioSettings => {
  const newSettings = { ...defaultSettings };

  Object.keys(oldSettings).forEach(key => {
    if (key in newSettings) {
      const settingKey = key as keyof AudioSettings;
      if (key === 'supportedModels' || key === 'supportedLanguages') {
        // Always use latest lists
        newSettings[settingKey] = defaultSettings[settingKey];
      } else {
        newSettings[settingKey] = oldSettings[settingKey] as AudioSettings[keyof AudioSettings];
      }
    }
  });

  return newSettings;
};