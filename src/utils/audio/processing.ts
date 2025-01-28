import { pipeline } from '@huggingface/transformers';
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../settings';
import { Transcription } from '@/types/audio/transcription';
import { PretrainedModelOptions, AudioProcessingOptions, ProcessingResult } from '@/types/audio/processing';

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  console.log('Processing audio buffer...');
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const channelData = audioBuffer.getChannelData(0);
  return channelData;
};

export const transcribeAudio = async (audioData: Float32Array): Promise<Transcription[]> => {
  console.log('Transcribing audio...');
  const settings = getSettings();
  
  const modelOptions: PretrainedModelOptions = {
    device: "webgpu",
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null
  };

  const processingOptions: AudioProcessingOptions = {
    chunkLength: settings.defaultChunkLength,
    strideLength: settings.defaultStrideLength,
    language: settings.defaultLanguage === 'auto' ? 'en' : settings.defaultLanguage,
    task: "transcribe",
    return_timestamps: true,
    max_new_tokens: 128,
    num_beams: 1,
    temperature: 0,
    no_repeat_ngram_size: 3
  };

  try {
    const transcriber = await pipeline("automatic-speech-recognition", settings.defaultModel, modelOptions);
    const result = await transcriber(audioData, processingOptions);
    
    if (!Array.isArray(result.chunks)) {
      throw new Error('Unexpected transcription result format');
    }

    return result.chunks.map((chunk: ProcessingResult) => ({
      id: uuidv4(),
      text: chunk.text,
      start: chunk.start,
      end: chunk.end,
      confidence: chunk.confidence,
      speaker: {
        id: `speaker-1`,
        name: 'Speaker 1',
        color: settings.speakerColors[0]
      }
    }));
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};