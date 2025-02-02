import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';

interface AudioUploadFormProps {
  onUpload: (file: File) => void;
}

export const AudioUploadForm: React.FC<AudioUploadFormProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const { settings } = useSettings();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (file) {
      onUpload(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700">
          Select Audio File
        </label>
        <input
          type="file"
          id="audio-file"
          accept="audio/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      <button
        type="submit"
        disabled={!file}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        Upload
      </button>
    </form>
  );
};