/**
 * Utility functions for determining audio file types based on file signatures
 */

/**
 * Supported audio MIME types
 */
export enum AudioMimeType {
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',
  AAC = 'audio/aac',
  FLAC = 'audio/flac',
  ALAC = 'audio/alac',
  AIFF = 'audio/aiff',
  M4A = 'audio/m4a',
  PCM = 'audio/pcm',
  DSD = 'audio/dsd',
  MP4 = 'audio/mp4',
  WEBM = 'audio/webm',
  OPUS = 'audio/opus',
  MIDI = 'audio/midi',
  VORBIS = 'audio/vorbis'
}

/**
 * File signature patterns for audio formats
 */
const SIGNATURES = {
  WAV: [0x52, 0x49, 0x46, 0x46], // 'RIFF'
  MP3: [0x49, 0x44, 0x33], // 'ID3'
  OGG: [0x4F, 0x67, 0x67, 0x53], // 'OggS'
  FLAC: [0x66, 0x4C, 0x61, 0x43], // 'fLaC'
  M4A: [0x66, 0x74, 0x79, 0x70], // 'ftyp'
  AAC: [0x41, 0x44, 0x49, 0x46], // 'ADIF'
  AIFF: [0x46, 0x4F, 0x52, 0x4D], // 'FORM'
  MIDI: [0x4D, 0x54, 0x68, 0x64], // 'MThd'
  WEBM: [0x1A, 0x45, 0xDF, 0xA3], // WEBM signature
};

/**
 * Determines the MIME type of an audio file based on its header signature
 * @param audioData - The audio data buffer to analyze
 * @returns The detected MIME type
 */
export const determineAudioType = (audioData: ArrayBuffer): AudioMimeType => {
  const header = new Uint8Array(audioData.slice(0, 12));
  
  // Check for WAV
  if (matchSignature(header, SIGNATURES.WAV)) {
    return AudioMimeType.WAV;
  }
  
  // Check for MP3 (ID3v2 header or MPEG sync)
  if (matchSignature(header, SIGNATURES.MP3) || 
      (header[0] === 0xFF && (header[1] & 0xE0) === 0xE0)) {
    return AudioMimeType.MP3;
  }
  
  // Check for AAC
  if (matchSignature(header, SIGNATURES.AAC)) {
    return AudioMimeType.AAC;
  }
  
  // Check for M4A/MP4
  if (matchSignature(header.slice(4), SIGNATURES.M4A)) {
    return AudioMimeType.M4A;
  }
  
  // Check for OGG
  if (matchSignature(header, SIGNATURES.OGG)) {
    return AudioMimeType.OGG;
  }
  
  // Check for FLAC
  if (matchSignature(header, SIGNATURES.FLAC)) {
    return AudioMimeType.FLAC;
  }
  
  // Check for AIFF
  if (matchSignature(header, SIGNATURES.AIFF)) {
    return AudioMimeType.AIFF;
  }
  
  // Check for MIDI
  if (matchSignature(header, SIGNATURES.MIDI)) {
    return AudioMimeType.MIDI;
  }
  
  // Check for WEBM
  if (matchSignature(header, SIGNATURES.WEBM)) {
    return AudioMimeType.WEBM;
  }
  
  // Default to WAV if unknown
  return AudioMimeType.WAV;
};

/**
 * Helper function to match byte signatures
 */
const matchSignature = (header: Uint8Array, signature: number[]): boolean => {
  return signature.every((byte, index) => header[index] === byte);
};