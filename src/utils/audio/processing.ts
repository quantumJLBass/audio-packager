import { Transcription } from '@/types/audio/transcription';
import { pipeline } from "@huggingface/transformers";
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../settings';
import { determineAudioTypeFromBuffer } from './fileType';
import { buildModelPath } from './modelBuilder';
import { toast } from '@/components/ui/use-toast';

// Create a worker pool for transcription tasks
const workerPool = new Set<Worker>();
const MAX_WORKERS = 4;

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

export const transcribeAudio = async (audioData: Float32Array): Promise<Transcription[]> => {
  const settings = getSettings();
  console.log('Starting transcription with settings:', settings);

  // Create an AbortController for cancellation
  const abortController = new AbortController();
  const { signal } = abortController;

  try {
    const selectedModel = settings.supportedModels.find(m => m.id === settings.defaultModel);
    if (!selectedModel) {
      console.warn('Selected model not found, falling back to default:', settings.defaultModel);
    }
    const modelToUse = selectedModel?.id || settings.defaultModel;
    console.log('Selected model:', modelToUse);

    const modelPath = buildModelPath(modelToUse);
    console.log('Using model path:', modelPath);

    // Create transcription pipeline with proper configuration
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      modelPath,
      {
        device: settings.modelConfig.device,
        revision: settings.modelRevision,
        cache_dir: settings.enableModelCaching ? undefined : null,
        dtype: settings.modelConfig.dtype,
        model_id: modelToUse,
        task: "transcribe"
      }
    );

    // Convert Float32Array to base64 in a non-blocking way
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

    // Show progress toast
    toast({
      title: "Transcription in progress",
      description: "Processing audio file...",
      duration: null // Keep until complete
    });

    // Process transcription in chunks to prevent UI blocking
    const chunkSize = 30 * settings.audioSampleRate; // 30 seconds chunks
    const chunks: Transcription[] = [];
    
    for (let i = 0; i < audioData.length; i += chunkSize) {
      if (signal.aborted) {
        throw new Error('Transcription cancelled');
      }

      const chunk = audioData.slice(i, i + chunkSize);
      const result = await transcriber(chunk, {
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

      if (result.chunks) {
        const processedChunks = result.chunks.map((chunk: any, index: number) => ({
          id: uuidv4(),
          text: chunk.text || settings.noSpeechText,
          start: chunk.timestamp[0] || 0,
          end: chunk.timestamp[1] || 0,
          confidence: chunk.confidence || settings.defaultConfidence,
          speaker: {
            id: settings.speakerIdTemplate.replace('{?}', `${Math.floor(index / 2) + 1}`),
            name: settings.speakerNameTemplate.replace('{?}', `${Math.floor(index /2) + 1}'`),
            color: settings.speakerColors[Math.floor(index / 2) % settings.speakerColors.length]
          }
        }));
        chunks.push(...processedChunks);

        // Update progress
        toast({
          title: "Transcription progress",
          description: `Processed ${Math.min(((i + chunkSize) / audioData.length) * 100, 100).toFixed(1)}%`,
          duration: null
        });
      }
    }

    // Clear progress toast and show success
    toast({
      title: "Transcription complete",
      description: `Successfully processed ${chunks.length} segments`,
      duration: 3000
    });

    return chunks;
  } catch (error) {
    console.error('Transcription error:', error);
    
    // Show error toast
    toast({
      title: "Transcription failed",
      description: error instanceof Error ? error.message : 'An unknown error occurred',
      variant: "destructive"
    });
    
    throw error;
  } finally {
    abortController.abort(); // Cleanup
  }
};

// Helper function to create a transcription worker
const createTranscriptionWorker = () => {
  const worker = new Worker(
    new URL('./transcriptionWorker.ts', import.meta.url),
    { type: 'module' }
  );
  
  workerPool.add(worker);
  return worker;
};

// Cleanup function for workers
export const cleanupTranscriptionWorkers = () => {
  workerPool.forEach(worker => {
    worker.terminate();
  });
  workerPool.clear();
};