import { pipeline } from "@huggingface/transformers";
import { AudioAnalysis, Transcription, AudioProcessingOptions } from "@/types/audio";
import { getSettings } from "./settings";

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.getChannelData(0);
  } catch (error) {
    console.error('Error processing audio buffer:', error);
    throw new Error('Failed to process audio buffer');
  }
};

export const transcribeAudio = async (
  float32Array: Float32Array,
  options: AudioProcessingOptions
): Promise<Transcription[]> => {
  try {
    const settings = getSettings();
    const transcriber = await pipeline("automatic-speech-recognition", options.model, {
      apiKey: options.huggingFaceToken,
      revision: settings.modelRevision,
      cache: settings.enableModelCaching,
    });
    
    const result = await transcriber(float32Array, {
      language: options.language === 'auto' ? null : options.language,
      return_timestamps: true,
      chunk_length_s: options.chunkLength,
      stride_length_s: options.strideLength,
    });

    const chunks = Array.isArray(result) ? result : [result];
    const colors = getSettings().speakerColors;
    
    return chunks.map((chunk: any, index: number) => ({
      text: chunk.text || "(no speech detected)",
      start: chunk.timestamp?.[0] || index * options.strideLength,
      end: chunk.timestamp?.[1] || (index + 1) * options.strideLength,
      confidence: chunk.confidence || 0.95,
      speaker: {
        id: `speaker-${index % 2 + 1}`,
        name: `Speaker ${index % 2 + 1}`,
        color: colors[index % colors.length]
      }
    }));
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};

export const analyzeSentiment = async (text: string): Promise<string> => {
  try {
    const settings = getSettings();
    const classifier = await pipeline(
      "text-classification",
      settings.sentimentModel,
      { apiKey: settings.huggingFaceToken }
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
  try {
    const settings = getSettings();
    const sampleRate = settings.audioSampleRate;
    const bufferSize = settings.fftSize;
    
    // Implement autocorrelation-based pitch detection
    const correlations = new Float32Array(bufferSize);
    for (let lag = 0; lag < bufferSize; lag++) {
      let correlation = 0;
      for (let i = 0; i < bufferSize - lag; i++) {
        correlation += audioData[i] * audioData[i + lag];
      }
      correlations[lag] = correlation;
    }
    
    // Find the highest correlation peak
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
  try {
    const settings = getSettings();
    const sampleRate = settings.audioSampleRate;
    const bufferSize = settings.fftSize;
    
    // Implement onset detection for tempo estimation
    const energyProfile = new Float32Array(Math.floor(audioData.length / bufferSize));
    for (let i = 0; i < energyProfile.length; i++) {
      let sum = 0;
      for (let j = 0; j < bufferSize; j++) {
        sum += Math.abs(audioData[i * bufferSize + j]);
      }
      energyProfile[i] = sum;
    }
    
    // Find peaks in energy profile
    const peaks = [];
    for (let i = 1; i < energyProfile.length - 1; i++) {
      if (energyProfile[i] > energyProfile[i - 1] && 
          energyProfile[i] > energyProfile[i + 1] &&
          energyProfile[i] > settings.onsetThreshold) {
        peaks.push(i);
      }
    }
    
    // Calculate average time between peaks
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