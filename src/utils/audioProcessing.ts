import { pipeline } from "@huggingface/transformers";
import { AutomaticSpeechRecognitionOutput } from "@huggingface/transformers";

export const processAudioBuffer = async (arrayBuffer: ArrayBuffer): Promise<Float32Array> => {
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.getChannelData(0);
};

export const transcribeAudio = async (float32Array: Float32Array): Promise<AutomaticSpeechRecognitionOutput> => {
  const transcriber = await pipeline(
    "automatic-speech-recognition",
    "onnx-community/whisper-tiny.en",
    { device: "webgpu" }
  );

  return await transcriber(float32Array, {
    chunk_length_s: 30,
    stride_length_s: 5,
    return_timestamps: true
  });
};