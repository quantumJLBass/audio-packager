import type { AudioSettings } from '@/types/audio/settings';
import { defaultSettings } from './defaults';

export const migrateSettings = (oldSettings: Partial<AudioSettings>, currentVersion: string): AudioSettings => {
  const newSettings = { ...defaultSettings };

  Object.entries(oldSettings).forEach(([key, value]) => {
    if (key in newSettings) {
      if (key === 'supportedModels' || key === 'supportedLanguages') {
        // Always use latest lists
        return;
      }
      (newSettings as any)[key] = value;
    }
  });

  return newSettings;
};