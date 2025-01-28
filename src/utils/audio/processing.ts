import { pipeline } from "@huggingface/transformers";
import { getSettings } from '@/utils/settings';
import { Transcription } from '@/types/audio/transcription';
import { v4 as uuidv4 } from 'uuid';

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  console.log('Processing audio buffer...');
  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log('Audio buffer processed successfully');
    return audioBuffer.getChannelData(0);
  } catch (error) {
    console.error('Error processing audio buffer:', error);
    throw new Error('Failed to process audio buffer');
  }
};

export const transcribeAudio = async (float32Array: Float32Array): Promise<Transcription[]> => {
  const settings = getSettings();
  console.log('Starting transcription with settings:', settings);
  
  try {
    const modelPath = 'onnx-community/whisper-tiny.en';
    console.log('Using model path:', modelPath);
    
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      modelPath,
      { 
        device: "webgpu",
        revision: settings.modelRevision,
        cache_dir: settings.enableModelCaching ? undefined : null
      }
    );
    
    const result = await transcriber(float32Array, {
      language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
      task: "transcribe",
      chunk_length_s: settings.defaultChunkLength,
      stride_length_s: settings.defaultStrideLength,
      return_timestamps: true
    });
    
    console.log('Transcription result:', result);
    
    const chunks = Array.isArray(result) ? result : [result];
    return chunks.map((chunk: any): Transcription => ({
      id: uuidv4(),
      text: chunk.text?.trim() ?? settings.noSpeechText,
      start: chunk.timestamp?.[0] ?? 0,
      end: chunk.timestamp?.[1] ?? 0,
      confidence: chunk.confidence ?? settings.defaultConfidence,
      speaker: {
        id: settings.speakerIdTemplate.replace('{idx}', '1'),
        name: settings.speakerNameTemplate.replace('{idx}', '1'),
        color: settings.speakerColors[0]
      }
    }));
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};