import { pipeline, AutomaticSpeechRecognitionOutput } from '@huggingface/transformers';
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../settings';
import { Transcription } from '@/types/audio/transcription';
import { PretrainedModelOptions, AudioProcessingOptions } from '@/types/audio/processing';

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
    cache_dir: settings.enableModelCaching ? undefined : null,
    dtype: "fp32"
  };

  const processingOptions: AudioProcessingOptions = {
    chunkLength: settings.defaultChunkLength,
    strideLength: settings.defaultStrideLength,
    language: 'en',
    task: "transcribe",
    return_timestamps: true,
    max_new_tokens: 225,
    num_beams: 5,
    temperature: 0.0,
    no_repeat_ngram_size: 3
  };

  try {
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "distil-whisper/distil-small.en",
      modelOptions
    );

    const result = await transcriber(audioData, processingOptions) as AutomaticSpeechRecognitionOutput;
    
    if (!Array.isArray(result) && result.text) {
      return [{
        id: uuidv4(),
        text: result.text,
        start: 0,
        end: 0,
        confidence: 1,
        speaker: {
          id: `speaker-1`,
          name: 'Speaker 1',
          color: settings.speakerColors[0]
        }
      }];
    }
    
    throw new Error('Invalid transcription result format');
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};