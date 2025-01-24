import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Transcription, Speaker } from '@/types/audio';
import { SpeakerDialog } from './audio/SpeakerDialog';
import { TranscriptionList } from './audio/TranscriptionList';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TranscriptionDisplayProps {
  transcriptions: Transcription[];
  currentTime: number;
  onTranscriptionUpdate?: (updatedTranscription: Transcription) => void;
  onTranscriptionSplit?: (transcription: Transcription, time: number) => void;
  onTranscriptionAdd?: (time: number, position: 'before' | 'after') => void;
  onTranscriptionDelete?: (transcription: Transcription) => void;
  onTimeClick?: (time: number) => void;
  onSpeakerUpdate?: (speakerId: string, newName: string, updateAll: boolean) => void;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcriptions,
  currentTime,
  onTranscriptionUpdate,
  onTranscriptionSplit,
  onTranscriptionAdd,
  onTranscriptionDelete,
  onTimeClick,
  onSpeakerUpdate,
}) => {
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addPosition, setAddPosition] = useState<'before' | 'after'>('after');
  const [addTime, setAddTime] = useState(0);

  const handleTranscriptionUpdate = (transcript: Transcription) => {
    onTranscriptionUpdate?.(transcript);
  };

  const handleTranscriptionSplit = (transcript: Transcription) => {
    if (onTranscriptionSplit) {
      const splitTime = (transcript.start + transcript.end) / 2;
      onTranscriptionSplit(transcript, splitTime);
    }
  };

  const handleTranscriptionAdd = (transcript: Transcription) => {
    setAddTime(transcript.end);
    setShowAddDialog(true);
  };

  const handleAddConfirm = () => {
    if (onTranscriptionAdd) {
      onTranscriptionAdd(addTime, addPosition);
    }
    setShowAddDialog(false);
  };

  const handleSpeakerClick = (transcript: Transcription) => {
    if (transcript.speaker) {
      setEditingSpeaker(transcript.speaker);
    }
  };

  const handleSpeakerSave = (name: string, updateAll: boolean) => {
    if (editingSpeaker && onSpeakerUpdate) {
      onSpeakerUpdate(editingSpeaker.id, name, updateAll);
    }
    setEditingSpeaker(null);
  };

  return (
    <Card className="glass">
      <TranscriptionList
        transcriptions={transcriptions}
        currentTime={currentTime}
        onTranscriptionUpdate={handleTranscriptionUpdate}
        onTranscriptionSplit={handleTranscriptionSplit}
        onTranscriptionAdd={handleTranscriptionAdd}
        onTranscriptionDelete={onTranscriptionDelete!}
        onTimeClick={onTimeClick!}
        onSpeakerClick={handleSpeakerClick}
      />
      
      {editingSpeaker && (
        <SpeakerDialog
          isOpen={true}
          onClose={() => setEditingSpeaker(null)}
          speaker={editingSpeaker}
          onSave={handleSpeakerSave}
        />
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transcription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant={addPosition === 'before' ? 'default' : 'outline'}
                onClick={() => setAddPosition('before')}
              >
                Add Before
              </Button>
              <Button
                variant={addPosition === 'after' ? 'default' : 'outline'}
                onClick={() => setAddPosition('after')}
              >
                Add After
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddConfirm}>
              Add Transcription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};