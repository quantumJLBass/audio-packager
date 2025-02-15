import React from 'react';
import { ProcessingStatus } from '../processing/ProcessingStatus';
import { TranscriptionSection } from '../TranscriptionSection';
import { ProcessingState } from '@/types/audio/processing';

interface AudioProcessingStateProps extends ProcessingState {
  onTimeUpdate: (time: number) => void;
}

export const AudioProcessingStateComponent: React.FC<AudioProcessingStateProps> = ({
  isTranscribing,
  error,
  transcriptions,
  currentTime,
  onTimeUpdate
}) => {
  return (
    <>
      <ProcessingStatus
        isTranscribing={isTranscribing}
        error={error}
      />

      {!isTranscribing && !error && transcriptions.length > 0 && (
        <TranscriptionSection
          transcriptions={transcriptions}
          currentTime={currentTime}
          onTimeClick={onTimeUpdate}
        />
      )}
    </>
  );
};