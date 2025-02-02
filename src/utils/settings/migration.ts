import type { AudioSettings } from '@/types/audio/settings';
import { defaultSettings } from './defaults';

export const migrateSettings = (oldSettings: Partial<AudioSettings>, currentVersion: string): AudioSettings => {
  const newSettings: AudioSettings = { ...defaultSettings };

  // Type-safe way to copy settings
  (Object.keys(oldSettings) as Array<keyof AudioSettings>).forEach(key => {
    if (key in newSettings) {
      if (key === 'supportedModels' || key === 'supportedLanguages') {
        // Always use latest lists
        newSettings[key] = defaultSettings[key];
      } else {
        newSettings[key] = oldSettings[key] as AudioSettings[keyof AudioSettings];
      }
    }
  });

  return newSettings;
};