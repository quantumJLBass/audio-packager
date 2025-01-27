import { pipeline } from "@huggingface/transformers";
import { Transcription, PretrainedModelOptions, TranscriptionConfig, AudioSettings } from "@/types/audio";
import { getSettings } from "@/utils/settings";

const getModelPath = (modelId: string): string => {
  // Use a smaller model that's more likely to work in the browser
  return `openai/whisper-small`;
};

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  console.log('Processing audio buffer...');
  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log('Audio buffer processed successfully');
    return audioBuffer.getChannelData(0);
  } catch (error) {
    console.error('Error processing audio buffer:', error);
    throw new Error('Failed to process audio buffer. Please try a different file.');
  }
};

export const transcribeAudio = async (float32Array: Float32Array, settings: AudioSettings): Promise<Transcription[]> => {
  console.log('Starting transcription with settings:', settings);
  try {
    const modelPath = getModelPath(settings.defaultModel);
    console.log('Using model path:', modelPath);
    
    const modelConfig: PretrainedModelOptions = {
      revision: settings.modelRevision,
      cache_dir: settings.enableModelCaching ? undefined : null,
      device: "webgpu",
      dtype: "fp32" as const
    };

    console.log('Creating pipeline with config:', modelConfig);
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      modelPath,
      modelConfig
    );
    
    console.log('Pipeline created, starting transcription...');
    const transcriptionConfig: TranscriptionConfig = {
      language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
      task: "transcribe",
      chunk_length_s: settings.defaultChunkLength,
      stride_length_s: settings.defaultStrideLength,
      return_timestamps: true,
      max_new_tokens: 128,
      num_beams: 1,
      temperature: 0,
      no_repeat_ngram_size: 3
    };

    const result = await transcriber(float32Array, transcriptionConfig);
    console.log('Transcription result:', result);

    const chunks = Array.isArray(result) ? result : [result];
    
    return chunks.map((chunk: any, index: number) => ({
      text: chunk.text || settings.noSpeechText,
      start: chunk.timestamp?.[0] || index * settings.defaultStrideLength,
      end: chunk.timestamp?.[1] || (index + 1) * settings.defaultStrideLength,
      confidence: chunk.confidence || settings.defaultConfidence,
      speaker: {
        id: settings.speakerIdTemplate.replace('{idx}', String(index % settings.maxSpeakers + 1)),
        name: settings.speakerNameTemplate.replace('{idx}', String(index % settings.maxSpeakers + 1)),
        color: settings.speakerColors[index % settings.speakerColors.length]
      }
    }));
  } catch (error) {
    console.error('Transcription error:', error);
    if (error.message?.includes('Unauthorized')) {
      throw new Error('Invalid HuggingFace token. Please check your settings and try again.');
    }
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

export const analyzeSentiment = async (text: string): Promise<string> => {
  try {
    const settings = getSettings();
    const classifier = await pipeline(
      "text-classification",
      settings.sentimentModel,
      { device: "webgpu", dtype: "fp32" }
    );
    
    const result = await classifier(text);
    return (result as any)[0]?.label || 'neutral';
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    throw new Error('Failed to analyze sentiment');
  }
};

export const analyzeTone = async (audioData: Float32Array): Promise<{
  pitch: number;
  tempo: number;
  energy: number;
}> => {
  const settings = getSettings();
  try {
    return {
      pitch: calculatePitch(audioData, settings),
      tempo: calculateTempo(audioData, settings),
      energy: calculateEnergy(audioData)
    };
  } catch (error) {
    console.error('Tone analysis error:', error);
    throw new Error('Failed to analyze tone');
  }
};

const calculatePitch = (audioData: Float32Array, settings: AudioSettings): number => {
  try {
    const correlations = new Float32Array(settings.fftSize);
    
    for (let lag = 0; lag < settings.fftSize; lag++) {
      let correlation = 0;
      for (let i = 0; i < settings.fftSize - lag; i++) {
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
    
    return settings.audioSampleRate / maxLag;
  } catch (error) {
    console.error('Pitch calculation error:', error);
    return getSettings().defaultPitch;
  }
};

const calculateTempo = (audioData: Float32Array, settings: AudioSettings): number => {
  try {
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
    
    if (peaks.length < 2) {
      return settings.defaultTempo;
    }
    
    const avgTimeBetweenPeaks = (peaks[peaks.length - 1] - peaks[0]) / (peaks.length - 1);
    const bpm = 60 / (avgTimeBetweenPeaks * bufferSize / settings.audioSampleRate);
    
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
