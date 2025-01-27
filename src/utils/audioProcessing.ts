import { pipeline } from "@huggingface/transformers";
import { AudioAnalysis, Transcription, AudioSettings } from "@/types/audio";

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

export const transcribeAudio = async (float32Array: Float32Array, settings: AudioSettings): Promise<Transcription[]> => {
  try {
    const transcriber = await pipeline("automatic-speech-recognition", settings.defaultModel, {
      quantized: true,
      revision: settings.modelRevision,
      cache_dir: settings.enableModelCaching ? undefined : null,
    });
    
    const result = await transcriber(float32Array, {
      language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
      return_timestamps: true,
      chunk_length_s: settings.defaultChunkLength,
      stride_length_s: settings.defaultStrideLength,
    });

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
    throw new Error('Failed to transcribe audio');
  }
};

export const calculatePitch = (audioData: Float32Array): number => {
  try {
    const settings = getSettings();
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
    return settings.defaultPitch;
  }
};