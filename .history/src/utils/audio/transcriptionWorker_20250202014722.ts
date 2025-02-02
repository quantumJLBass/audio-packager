import { pipeline } from '@huggingface/transformers';
import { getSettings } from '../settings';
import { buildModelPath } from './modelBuilder';

// Worker context
const ctx: Worker = self as any;

let transcriber: any = null;

// Initialize the transcription pipeline
const initializeTranscriber = async () => {
  const settings = getSettings();
  const modelPath = buildModelPath(settings);

  transcriber = await pipeline(
    "automatic-speech-recognition",
    modelPath,
    {

      device: settings.modelConfig.device as "auto" | "gpu" | "cpu" | "wasm" | "webgpu" | "cuda" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu",
      revision: settings.modelRevision,
      cache_dir: settings.enableModelCaching ? undefined : null,
      dtype: settings.modelConfig.dtype as "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16",
      local_files_only: true
    }
  );
};

// Handle messages from the main thread
ctx.addEventListener('message', async (event) => {
  const { audioData, settings, id } = event.data;

  try {
    if (!transcriber) {
      await initializeTranscriber();
    }

    const result = await transcriber(audioData, {
      language: settings.defaultLanguage === 'auto' ? null : settings.defaultLanguage,
      task: settings.processingTask,
      chunk_length_s: settings.defaultChunkLength,
      stride_length_s: settings.defaultStrideLength,
      return_timestamps: settings.returnTimestamps
    });

    ctx.postMessage({ type: 'success', result, id });
  } catch (error) {
    ctx.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    });
  }
});

// Handle cleanup
ctx.addEventListener('close', () => {
  if (transcriber) {
    transcriber = null;
  }
});
