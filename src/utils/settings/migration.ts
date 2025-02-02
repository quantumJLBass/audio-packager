import type { AudioSettings } from '@/types/audio/settings';
import { defaultSettings } from './settings';

export const migrateSettings = (oldSettings: Partial<AudioSettings>, currentVersion: string): AudioSettings => {
  const newSettings = { ...defaultSettings };

  Object.keys(oldSettings).forEach(key => {
    if (key in newSettings) {
      if (key === 'supportedModels' || key === 'supportedLanguages') {
        // Always use latest lists
        newSettings[key as keyof AudioSettings] = defaultSettings[key as keyof AudioSettings];
      } else {
        const settingKey = key as keyof AudioSettings;
        (newSettings[settingKey] as any) = oldSettings[settingKey];
      }
    }
  });

  return newSettings;
};