import { pipeline } from "@huggingface/transformers";
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../settings';
import { determineAudioTypeFromBuffer } from './fileType';
import { buildModelPath } from './modelBuilder';
import { toast } from '@/components/ui/use-toast';
import { DebugLogger } from '../debug';
import { Transcription } from '@/types/audio/transcription';

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  DebugLogger.log('Processing', 'Processing audio buffer...');
  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    DebugLogger.log('Processing', 'Audio buffer processed successfully');
    return audioBuffer.getChannelData(0);
  } catch (error) {
    DebugLogger.error('Processing', 'Error processing audio buffer:', error);
    throw new Error('Failed to process audio buffer');
  }
};

export const transcribeAudio = async (audioData: Float32Array): Promise<Transcription[]> => {
  const settings = getSettings();
  DebugLogger.log('Transcription', 'Starting transcription with settings:', settings);

  const selectedModel = settings.supportedModels.find(m => m.id === settings.defaultModel);
  if (!selectedModel) {
    DebugLogger.warn('Transcription', 'Selected model not found, falling back to default:', settings.defaultModel);
  }
  const modelToUse = selectedModel?.id || settings.defaultModel;
  DebugLogger.log('Transcription', 'Selected model:', modelToUse);

  const modelPath = buildModelPath(modelToUse);
  DebugLogger.log('Transcription', 'Using model path:', modelPath);

  try {
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      modelPath,
      {
        device: settings.modelConfig.device,
        revision: settings.modelRevision,
        cache_dir: settings.enableModelCaching ? undefined : null,
        dtype: settings.modelConfig.dtype,
        isQuantized: settings.modelConfig.useQuantized,
        local_files_only: true // Force using local files to prevent external data loading errors
      }
    );

    const audioBlob = new Blob([audioData], {
      type: determineAudioTypeFromBuffer(audioData.buffer),
    });

    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    toast({
      title: "Processing Audio",
      description: "Transcription in progress...",
      duration: null
    });

    const result = await transcriber(base64String, {
      language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
      task: settings.processingTask,
      chunk_length_s: settings.defaultChunkLength,
      stride_length_s: settings.defaultStrideLength,
      return_timestamps: settings.returnTimestamps,
      max_new_tokens: settings.maxNewTokens,
      num_beams: settings.numBeams,
      temperature: settings.temperature,
      no_repeat_ngram_size: settings.noRepeatNgramSize
    });

    const results = Array.isArray(result) ? result : [result];
    
    const transcriptions = results.map((item, index) => ({
      id: uuidv4(),
      text: item.text || settings.noSpeechText,
      start: item.chunks?.[0]?.timestamp?.[0] ?? 0,
      end: item.chunks?.[0]?.timestamp?.[1] ?? 0,
      confidence: settings.defaultConfidence,
      speaker: {
        id: settings.speakerIdTemplate.replace('{?}', `${Math.floor(index / 2) + 1}`),
        name: settings.speakerNameTemplate.replace('{?}', `${Math.floor(index / 2) + 1}`),
        color: settings.speakerColors[Math.floor(index / 2) % settings.speakerColors.length]
      }
    }));

    toast({
      title: "Success",
      description: "Audio transcription complete",
      duration: 3000
    });

    return transcriptions;
  } catch (error) {
    DebugLogger.error('Transcription', 'Transcription error:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to transcribe audio",
      variant: "destructive"
    });
    throw error;
  }
};