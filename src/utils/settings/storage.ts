import type { AudioSettings } from '@/types/audio/settings';

const SETTINGS_KEY = 'audioSettings';
const SETTINGS_VERSION = '1.0.0';

export const saveToStorage = (settings: AudioSettings): void => {
  const settingsWithVersion = { 
    ...settings,
    _version: SETTINGS_VERSION 
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsWithVersion));
};

export const loadFromStorage = (): string | null => {
  return localStorage.getItem(SETTINGS_KEY);
};