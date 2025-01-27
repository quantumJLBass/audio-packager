import { pipeline } from "@huggingface/transformers";
import { AudioAnalysis, Transcription, AudioSettings } from "@/types/audio";
import { useToast } from "@/hooks/use-toast";

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.getChannelData(0);
};

export const transcribeAudio = async (float32Array: Float32Array, settings: AudioSettings): Promise<Transcription[]> => {
  try {
    const transcriber = await pipeline("automatic-speech-recognition", settings.defaultModel, {
      revision: settings.modelRevision,
      cache_dir: settings.enableModelCaching ? undefined : null,
      credentials: {
        accessToken: settings.huggingFaceToken
      }
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