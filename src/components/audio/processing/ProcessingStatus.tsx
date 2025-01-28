import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  isTranscribing: boolean;
  error: string | null;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  isTranscribing,
  error
}) => {
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (isTranscribing) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Processing audio...</p>
      </div>
    );
  }

  return null;
};