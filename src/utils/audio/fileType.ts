/**
 * Utility functions for determining audio file types based on file signatures
 */

/**
 * Determines the MIME type of an audio file based on its header signature
 * @param audioData - The audio data buffer to analyze
 * @returns The detected MIME type
 */
export const determineAudioType = (audioData: ArrayBuffer): string => {
  const header = new Uint8Array(audioData.slice(0, 12));
  
  // WAV: 'RIFF' header
  if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) {
    return 'audio/wav';
  }
  
  // MP3: ID3v2 header or MPEG sync
  if ((header[0] === 0x49 && header[1] === 0x44 && header[2] === 0x33) ||
      (header[0] === 0xFF && (header[1] & 0xE0) === 0xE0)) {
    return 'audio/mpeg';
  }
  
  // AAC: ADIF header
  if (header[0] === 0x41 && header[1] === 0x44 && header[2] === 0x49 && header[3] === 0x46) {
    return 'audio/aac';
  }
  
  // M4A/AAC: ftyp header
  if (header[4] === 0x66 && header[5] === 0x74 && header[6] === 0x79 && header[7] === 0x70) {
    return 'audio/mp4';
  }
  
  // OGG: OggS header
  if (header[0] === 0x4F && header[1] === 0x67 && header[2] === 0x67 && header[3] === 0x53) {
    return 'audio/ogg';
  }
  
  // FLAC: fLaC header
  if (header[0] === 0x66 && header[1] === 0x4C && header[2] === 0x61 && header[3] === 0x43) {
    return 'audio/flac';
  }
  
  // Default to WAV if unknown
  return 'audio/wav';
};