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
    quantized: true // Enable quantized model
  };

  const processingOptions: AudioProcessingOptions = {
    chunk_length_s: settings.defaultChunkLength,
    stride_length_s: settings.defaultStrideLength,
    language: settings.defaultLanguage === 'auto' ? 'en' : settings.defaultLanguage,
    task: "transcribe",
    return_timestamps: true
  };

  try {
    // Use a quantized model that's optimized for web browsers
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "distil-whisper/distil-small.en",
      modelOptions
    );

    const result = await transcriber(audioData, processingOptions) as AutomaticSpeechRecognitionOutput;
    
    if (!result.text) {
      throw new Error('No transcription result');
    }

    // Create segments from the transcription
    const segments: Transcription[] = [{
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

    return segments;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};