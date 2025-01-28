import React from 'react';
import { Card } from '@/components/ui/card';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { Transcription } from '@/types/audio/transcription';

interface TranscriptionSectionProps {
  transcriptions: Transcription[];
  currentTime: number;
  onTimeClick: (time: number) => void;
}

export const TranscriptionSection: React.FC<TranscriptionSectionProps> = ({
  transcriptions,
  currentTime,
  onTimeClick,
}) => {
  return (
    <TranscriptionDisplay
      transcriptions={transcriptions}
      currentTime={currentTime}
      onTimeClick={onTimeClick}
    />
  );
};