import { getSettings } from './settings';
import { format } from 'date-fns';

export const formatTimestamp = (time: number): string => {
  const settings = getSettings();
  const date = new Date(time * 1000);
  
  let formatted = format(date, settings.timeFormat);
  
  if (settings.showMilliseconds) {
    const ms = Math.floor((time % 1) * 1000);
    formatted += `.${ms.toString().padStart(3, '0')}`;
  }
  
  return formatted;
};