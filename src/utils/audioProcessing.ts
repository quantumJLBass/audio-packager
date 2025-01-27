import { pipeline } from "@huggingface/transformers";
import { Transcription } from "@/types/audio";
import { AudioSettings } from "@/utils/settings";

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
    // Create pipeline with proper authentication
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "openai/whisper-small",
      {
        revision: settings.modelRevision,
        cache_dir: settings.enableModelCaching ? undefined : null,
        accessToken: settings.huggingFaceToken
      }
    );
    
    console.log('Pipeline created, starting transcription...');
    const result = await transcriber(float32Array, {
      language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
      chunk_length_s: settings.defaultChunkLength,
      stride_length_s: settings.defaultStrideLength,
      return_timestamps: true,
      max_new_tokens: 128 // Limit output size
    });

    console.log('Transcription completed, processing results...');
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