/**
 * Utility functions for audio file type detection and validation
 */

/**
 * List of supported audio MIME types
 */
export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/flac',
  'audio/alac',
  'audio/aiff',
  'audio/m4a',
  'audio/pcm',
  'audio/dsd',
  'audio/mp4',
  'audio/webm',
  'audio/opus',
  'audio/midi',
  'audio/vorbis'
] as const;

export type SupportedAudioType = typeof SUPPORTED_AUDIO_TYPES[number];

/**
 * Checks if a file type is a supported audio format
 */
export const isSupportedAudioType = (type: string): type is SupportedAudioType => {
  return SUPPORTED_AUDIO_TYPES.includes(type as SupportedAudioType);
};

/**
 * Gets the file extension for a given audio MIME type
 */
export const getAudioFileExtension = (mimeType: SupportedAudioType): string => {
  const extensionMap: Record<SupportedAudioType, string> = {
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/ogg': '.ogg',
    'audio/aac': '.aac',
    'audio/flac': '.flac',
    'audio/alac': '.m4a',
    'audio/aiff': '.aiff',
    'audio/m4a': '.m4a',
    'audio/pcm': '.pcm',
    'audio/dsd': '.dsd',
    'audio/mp4': '.m4a',
    'audio/webm': '.webm',
    'audio/opus': '.opus',
    'audio/midi': '.midi',
    'audio/vorbis': '.ogg'
  };

  return extensionMap[mimeType];
};

/**
 * Validates an audio file based on its type and size
 */
export const validateAudioFile = (file: File): { valid: boolean; error?: string } => {
  if (!isSupportedAudioType(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type. Supported types are: ${SUPPORTED_AUDIO_TYPES.join(', ')}`
    };
  }

  // 500MB max file size
  const MAX_FILE_SIZE = 500 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 500MB limit'
    };
  }

  return { valid: true };
};

/**
 * Determines the audio type from file data
 */
export const determineAudioType = async (file: File): Promise<SupportedAudioType | null> => {
  const buffer = await file.arrayBuffer();
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

  // Default to the file's reported type if supported
  return isSupportedAudioType(file.type) ? file.type as SupportedAudioType : null;
};