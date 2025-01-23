import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Save, X, Split, Plus } from 'lucide-react';
import { Transcription, Speaker } from '@/types/audio';
import { useToast } from '@/hooks/use-toast';
import { SpeakerDialog } from './audio/SpeakerDialog';

interface TranscriptionDisplayProps {
  transcriptions: Transcription[];
  currentTime: number;
  onTranscriptionUpdate?: (updatedTranscription: Transcription) => void;
  onTranscriptionSplit?: (transcription: Transcription, time: number) => void;
  onTranscriptionAdd?: (time: number) => void;
  onTimeClick?: (time: number) => void;
  onSpeakerUpdate?: (speakerId: string, newName: string, updateAll: boolean) => void;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcriptions,
  currentTime,
  onTranscriptionUpdate,
  onTranscriptionSplit,
  onTranscriptionAdd,
  onTimeClick,
  onSpeakerUpdate
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const activeTranscript = transcriptions.find(
      t => currentTime >= t.start && currentTime <= t.end
    );
    
    if (activeTranscript) {
      const element = document.getElementById(`transcript-${activeTranscript.start}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime, transcriptions]);

  const handleEdit = (transcript: Transcription) => {
    setEditingId(transcript.start);
    setEditText(transcript.text);
  };

  const handleSave = (transcript: Transcription) => {
    try {
      if (!editText.trim()) {
        throw new Error("Transcription text cannot be empty");
      }

      if (onTranscriptionUpdate) {
        onTranscriptionUpdate({
          ...transcript,
          text: editText.trim()
        });
        
        toast({
          title: "Success",
          description: "Transcription updated successfully",
        });
      }
    } catch (error) {
      console.error('Error saving transcription:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save transcription",
        variant: "destructive",
      });
    } finally {
      setEditingId(null);
      setEditText("");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleTimeClick = (time: number) => {
    if (onTimeClick) {
      onTimeClick(time);
    }
  };

  const handleSpeakerEdit = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
  };

  const handleSpeakerSave = (name: string, updateAll: boolean) => {
    if (editingSpeaker && onSpeakerUpdate) {
      onSpeakerUpdate(editingSpeaker.id, name, updateAll);
    }
    setEditingSpeaker(null);
  };

  const handleSplit = (transcript: Transcription) => {
    if (onTranscriptionSplit) {
      const splitTime = (transcript.start + transcript.end) / 2;
      onTranscriptionSplit(transcript, splitTime);
    }
  };

  const handleAdd = (time: number) => {
    if (onTranscriptionAdd) {
      onTranscriptionAdd(time);
    }
  };

  return (
    <Card className="glass">
      <ScrollArea className="h-[400px] p-4">
        <div className="space-y-4" ref={scrollRef}>
          {transcriptions.map((transcript) => (
            <div
              key={transcript.start}
              id={`transcript-${transcript.start}`}
              className={`p-3 rounded-lg transition-colors group ${
                currentTime >= transcript.start && currentTime <= transcript.end
                  ? 'bg-primary/20'
                  : 'hover:bg-muted/50'
              }`}
              onMouseEnter={() => setHoveredId(transcript.start)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20"
                  onClick={() => handleTimeClick(transcript.start)}
                >
                  {new Date(transcript.start * 1000).toISOString().substr(14, 5)}
                </Badge>
                {transcript.speaker && (
                  <Badge 
                    style={{ backgroundColor: transcript.speaker.color }}
                    className="cursor-pointer"
                    onClick={() => handleSpeakerEdit(transcript.speaker!)}
                  >
                    {transcript.speaker.name}
                  </Badge>
                )}
                <div className="flex-1" />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleSplit(transcript)}
                  className={`${
                    hoveredId === transcript.start ? 'opacity-100' : 'opacity-0'
                  } transition-opacity`}
                >
                  <Split className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleAdd(transcript.end)}
                  className={`${
                    hoveredId === transcript.start ? 'opacity-100' : 'opacity-0'
                  } transition-opacity`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {editingId === transcript.start ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSave(transcript)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm flex-1">{transcript.text}</p>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(transcript)}
                    className={`${
                      hoveredId === transcript.start ? 'opacity-100' : 'opacity-0'
                    } transition-opacity`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {editingSpeaker && (
        <SpeakerDialog
          isOpen={true}
          onClose={() => setEditingSpeaker(null)}
          speaker={editingSpeaker}
          onSave={handleSpeakerSave}
        />
      )}
    </Card>
  );
};