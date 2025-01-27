import { pipeline } from "@huggingface/transformers";
import { getSettings } from "@/utils/settings";
import { getModelPath, createModelConfig, createTranscriptionConfig } from './modelConfig';

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  console.log('Processing audio buffer...');
  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const float32Array = audioBuffer.getChannelData(0);
    console.log('Audio buffer processed successfully');
    return float32Array;
  } catch (error) {
    console.error('Error processing audio buffer:', error);
    throw new Error('Failed to process audio buffer');
  }
};

export const transcribeAudio = async (float32Array: Float32Array): Promise<any[]> => {
  const settings = getSettings();
  const modelPath = getModelPath(settings.defaultModel);
  console.log('Using model path:', modelPath);

  try {
    const modelConfig = createModelConfig(settings);
    const transcriptionConfig = createTranscriptionConfig(settings);

    console.log('Creating pipeline with config:', modelConfig);
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      modelPath,
      modelConfig
    );

    const result = await transcriber(float32Array, transcriptionConfig);
    console.log('Transcription result:', result);

    const chunks = Array.isArray(result) ? result : [result];
    
    return chunks.map((chunk: any, index: number) => ({
      id: `segment-${index}`,
      start: chunk.timestamp?.[0] ?? 0,
      end: chunk.timestamp?.[1] ?? 0,
      text: chunk.text?.trim() ?? '',
      confidence: chunk.confidence ?? 1,
    }));
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};