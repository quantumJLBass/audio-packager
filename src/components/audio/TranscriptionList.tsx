import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TranscriptionItem } from './TranscriptionItem';
import { Transcription } from '@/types/audio';

interface TranscriptionListProps {
  transcriptions: Transcription[];
  currentTime: number;
  onTranscriptionUpdate: (transcription: Transcription) => void;
  onTranscriptionSplit: (transcription: Transcription) => void;
  onTranscriptionAdd: (transcription: Transcription) => void;
  onTranscriptionDelete: (transcription: Transcription) => void;
  onTimeClick: (time: number) => void;
  onSpeakerClick: (transcription: Transcription) => void;
}

export const TranscriptionList: React.FC<TranscriptionListProps> = ({
  transcriptions,
  currentTime,
  onTranscriptionUpdate,
  onTranscriptionSplit,
  onTranscriptionAdd,
  onTranscriptionDelete,
  onTimeClick,
  onSpeakerClick,
}) => {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {transcriptions.map((transcript) => (
          <TranscriptionItem
            key={transcript.start}
            transcript={transcript}
            isActive={currentTime >= transcript.start && currentTime <= transcript.end}
            onEdit={onTranscriptionUpdate}
            onSplit={onTranscriptionSplit}
            onAdd={onTranscriptionAdd}
            onDelete={onTranscriptionDelete}
            onTimeClick={onTimeClick}
            onSpeakerClick={onSpeakerClick}
          />
        ))}
      </div>
    </ScrollArea>
  );
};