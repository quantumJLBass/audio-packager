import { PretrainedModelOptions } from '@/types/audio/processing';
import { Transcription } from '@/types/audio/transcription';
import { pipeline } from "@huggingface/transformers";
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../settings';
import { buildModelUrl, buildConfigUrl, buildOnnxModelUrls } from './urlBuilder';
import { DebugLogger } from '../debug';

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  DebugLogger.logProcessingStep('Processing audio buffer');
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const channelData = audioBuffer.getChannelData(0);
  return channelData;
};

export const transcribeAudio = async (audioData: Float32Array): Promise<Transcription[]> => {
  DebugLogger.logProcessingStep('Starting transcription');
  const settings = getSettings();

  const modelOptions: PretrainedModelOptions = {
    device: settings.modelConfig.device,
    revision: settings.modelRevision,
    cache_dir: settings.enableModelCaching ? undefined : null,
    dtype: settings.modelConfig.dtype
  };

  try {
    const modelUrl = buildModelUrl({
      provider: settings.modelConfig.provider,
      model: settings.modelConfig.model,
      isQuantized: settings.modelConfig.useQuantized,
      isOnnx: settings.modelConfig.useOnnx,
      language: settings.defaultLanguage
    });

    DebugLogger.logModelPath(modelUrl);

    if (settings.modelConfig.useOnnx) {
      const onnxUrls = buildOnnxModelUrls(modelUrl);
      DebugLogger.log('ONNX model URLs:', onnxUrls);
    }

    const configUrl = buildConfigUrl(modelUrl);
    DebugLogger.log('Config URL:', configUrl);

    const transcriber = await pipeline(
      "automatic-speech-recognition",
      modelUrl,
      modelOptions
    );

    const result = await transcriber(audioData, {
      chunk_length_s: settings.defaultChunkLength,
      stride_length_s: settings.defaultStrideLength,
      return_timestamps: settings.returnTimestamps,
      max_new_tokens: settings.maxNewTokens,
      num_beams: settings.numBeams,
      temperature: settings.temperature,
      no_repeat_ngram_size: settings.noRepeatNgramSize
    });

    DebugLogger.log('Transcription result:', result);

    if (!Array.isArray(result) && result.chunks) {
      return result.chunks.map((chunk: any, index: number) => ({
        id: uuidv4(),
        text: chunk.text || settings.noSpeechText,
        start: chunk.timestamp[0] || 0,
        end: chunk.timestamp[1] || 0,
        confidence: chunk.confidence || settings.defaultConfidence,
        speaker: {
          id: settings.speakerIdTemplate.replace('{?}', String(Math.floor(index / 2) + 1)),
          name: settings.speakerNameTemplate.replace('{?}', String(Math.floor(index / 2) + 1)),
          color: settings.speakerColors[Math.floor(index / 2) % settings.speakerColors.length]
        }
      }));
    }

    return [];
  } catch (error) {
    DebugLogger.error('Transcription error:', error);
    throw error;
  }
};