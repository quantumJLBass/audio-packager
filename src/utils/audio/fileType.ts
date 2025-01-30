/**
 * Audio file type detection and validation utilities
 */
import { SupportedAudioType } from '@/types/audio/processing';

/**
 * Checks if a given MIME type is a supported audio format
 */
export const isSupportedAudioType = (mimeType: string): boolean => {
  const supportedTypes: SupportedAudioType[] = [
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac',
    'audio/flac', 'audio/alac', 'audio/aiff', 'audio/m4a',
    'audio/pcm', 'audio/dsd', 'audio/mp4', 'audio/webm',
    'audio/opus', 'audio/midi', 'audio/vorbis'
  ];
  return supportedTypes.includes(mimeType as SupportedAudioType);
};

/**
 * Validates an audio file's format and size
 */
export const validateAudioFile = (file: File) => {
  // Check file type
  if (!file.type.startsWith('audio/')) {
    return {
      valid: false,
      error: 'File must be an audio file'
    };
  }

  // Check if type is supported
  if (!isSupportedAudioType(file.type)) {
    return {
      valid: false,
      error: 'Unsupported audio format'
    };
  }

  // Check file size (100MB limit)
  const maxSize = 100 * 1024 * 1024; // 100MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 100MB'
    };
  }

  return { valid: true };
};

/**
 * Determines the audio type from ArrayBuffer data
 */
export const determineAudioTypeFromBuffer = (buffer: ArrayBuffer): SupportedAudioType => {
  const view = new DataView(buffer);

  // Check file signatures
  if (view.getUint32(0) === 0x52494646) { // "RIFF"
    return 'audio/wav';
  }
  if (view.getUint32(0) === 0x4F676753) { // "OggS"
    return 'audio/ogg';
  }
  if (view.getUint32(0) === 0x664C6143) { // "fLaC"
    return 'audio/flac';
  }
  if (view.getUint16(0) === 0xFFFA || view.getUint16(0) === 0xFFFB) {
    return 'audio/mpeg';
  }

  // Default to MP3 if no signature match
  return 'audio/mpeg';
};

// Re-export for backward compatibility
export const determineAudioType = determineAudioTypeFromBuffer;