import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { Transcription } from '@/types/audio/transcription';

interface TranscriptionSectionProps {
  isTranscribing: boolean;
  transcriptions: Transcription[];
  currentTime: number;
  onTimeClick: (time: number) => void;
}

export const TranscriptionSection: React.FC<TranscriptionSectionProps> = ({
  isTranscribing,
  transcriptions,
  currentTime,
  onTimeClick,
}) => {
  if (isTranscribing) {
    return (
      <Card className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Transcribing audio...</p>
      </Card>
    );
  }

  return (
    <TranscriptionDisplay
      transcriptions={transcriptions}
      currentTime={currentTime}
      onTimeClick={onTimeClick}
    />
  );
};