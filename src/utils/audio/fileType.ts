import { SupportedAudioType } from '@/types/audio/processing';

export const determineAudioType = (file: File): SupportedAudioType => {
  return file.type as SupportedAudioType || 'audio/wav';
};

export const determineAudioTypeFromBuffer = (buffer: ArrayBuffer): SupportedAudioType => {
  // Check magic numbers in buffer to identify format
  const view = new Uint8Array(buffer);
  
  // WAV: RIFF header
  if (view[0] === 0x52 && view[1] === 0x49 && view[2] === 0x46 && view[3] === 0x46) {
    return 'audio/wav';
  }
  
  // MP3: ID3 or MPEG sync
  if ((view[0] === 0x49 && view[1] === 0x44 && view[2] === 0x33) || 
      (view[0] === 0xFF && (view[1] & 0xE0) === 0xE0)) {
    return 'audio/mpeg';
  }
  
  // OGG: OggS
  if (view[0] === 0x4F && view[1] === 0x67 && view[2] === 0x67 && view[3] === 0x53) {
    return 'audio/ogg';
  }
  
  // Default to WAV if unknown
  return 'audio/wav';
};