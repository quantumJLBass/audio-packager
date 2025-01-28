import { pipeline } from "@huggingface/transformers";
import { getSettings } from '@/utils/settings';
import { AudioAnalysis } from '@/types/audio/analysis';

export const analyzeSentiment = async (text: string): Promise<string> => {
  try {
    const settings = getSettings();
    const classifier = await pipeline(
      "text-classification",
      settings.sentimentModel,
      { device: "webgpu" }
    );
    
    const result = await classifier(text);
    return (result as any)[0]?.label || 'neutral';
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    throw new Error('Failed to analyze sentiment');
  }
};

export const analyzeTone = async (audioData: Float32Array): Promise<AudioAnalysis['tone']> => {
  try {
    return {
      pitch: calculatePitch(audioData),
      tempo: calculateTempo(audioData),
      energy: calculateEnergy(audioData)
    };
  } catch (error) {
    console.error('Tone analysis error:', error);
    throw new Error('Failed to analyze tone');
  }
};

const calculatePitch = (audioData: Float32Array): number => {
  const settings = getSettings();
  try {
    const sampleRate = settings.audioSampleRate;
    const bufferSize = settings.fftSize;
    
    const correlations = new Float32Array(bufferSize);
    for (let lag = 0; lag < bufferSize; lag++) {
      let correlation = 0;
      for (let i = 0; i < bufferSize - lag; i++) {
        correlation += audioData[i] * audioData[i + lag];
      }
      correlations[lag] = correlation;
    }
    
    let maxCorrelation = 0;
    let maxLag = 0;
    for (let lag = settings.minPitchLag; lag < settings.maxPitchLag; lag++) {
      if (correlations[lag] > maxCorrelation) {
        maxCorrelation = correlations[lag];
        maxLag = lag;
      }
    }
    
    return sampleRate / maxLag;
  } catch (error) {
    console.error('Pitch calculation error:', error);
    return settings.defaultPitch;
  }
};

const calculateTempo = (audioData: Float32Array): number => {
  const settings = getSettings();
  try {
    const sampleRate = settings.audioSampleRate;
    const bufferSize = settings.fftSize;
    
    const energyProfile = new Float32Array(Math.floor(audioData.length / bufferSize));
    for (let i = 0; i < energyProfile.length; i++) {
      let sum = 0;
      for (let j = 0; j < bufferSize; j++) {
        sum += Math.abs(audioData[i * bufferSize + j]);
      }
      energyProfile[i] = sum;
    }
    
    const peaks = [];
    for (let i = 1; i < energyProfile.length - 1; i++) {
      if (energyProfile[i] > energyProfile[i - 1] && 
          energyProfile[i] > energyProfile[i + 1] &&
          energyProfile[i] > settings.onsetThreshold) {
        peaks.push(i);
      }
    }
    
    if (peaks.length < 2) return settings.defaultTempo;
    
    const avgTimeBetweenPeaks = (peaks[peaks.length - 1] - peaks[0]) / (peaks.length - 1);
    const bpm = 60 / (avgTimeBetweenPeaks * bufferSize / sampleRate);
    
    return Math.round(bpm);
  } catch (error) {
    console.error('Tempo calculation error:', error);
    return settings.defaultTempo;
  }
};

const calculateEnergy = (audioData: Float32Array): number => {
  try {
    const sum = audioData.reduce((acc, val) => acc + val * val, 0);
    return Math.sqrt(sum / audioData.length);
  } catch (error) {
    console.error('Energy calculation error:', error);
    return 0;
  }
};