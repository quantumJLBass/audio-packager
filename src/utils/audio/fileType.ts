import { SupportedAudioType } from '@/types/audio/processing';
import { DebugLogger } from '../debug';

/**
 * Creates an audio file from an ArrayBuffer with the appropriate MIME type
 * @param buffer - The audio data buffer
 * @returns A File object containing the audio data
 */
export const createAudioFileFromBuffer = (buffer: ArrayBuffer): File => {
  const type = determineAudioTypeFromBuffer(buffer);
  DebugLogger.log('FileType', `Creating audio file with type: ${type}`);
  return new File([buffer], 'audio', { type });
};

/**
 * Determines the audio MIME type from an ArrayBuffer by checking its header
 * @param buffer - The audio data buffer
 * @returns The detected MIME type
 */
export const determineAudioTypeFromBuffer = (buffer: ArrayBuffer): SupportedAudioType => {
  const header = new Uint8Array(buffer.slice(0, 4));
  DebugLogger.log('FileType', 'Analyzing file header:', Array.from(header));

  // Check file signatures
  if (header[0] === 0xFF && header[1] === 0xFB) {
    DebugLogger.log('FileType', 'Detected MP3 format');
    return 'audio/mpeg';
  }
  if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) {
    DebugLogger.log('FileType', 'Detected WAV format');
    return 'audio/wav';
  }
  if (header[0] === 0x4F && header[1] === 0x67 && header[2] === 0x67 && header[3] === 0x53) {
    DebugLogger.log('FileType', 'Detected OGG format');
    return 'audio/ogg';
  }

  DebugLogger.log('FileType', 'Defaulting to MP3 format');
  return 'audio/mpeg';
};