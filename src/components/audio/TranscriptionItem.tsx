import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, X, Split, Plus, Trash2 } from 'lucide-react';
import { Transcription } from '@/types/audio';
import { formatTimestamp } from '@/utils/timeFormat';

interface TranscriptionItemProps {
  transcript: Transcription;
  isActive: boolean;
  onEdit: (transcript: Transcription) => void;
  onSplit: (transcript: Transcription) => void;
  onAdd: (transcript: Transcription) => void;
  onDelete: (transcript: Transcription) => void;
  onTimeClick: (time: number) => void;
  onSpeakerClick: (transcript: Transcription) => void;
}

export const TranscriptionItem: React.FC<TranscriptionItemProps> = ({
  transcript,
  isActive,
  onEdit,
  onSplit,
  onAdd,
  onDelete,
  onTimeClick,
  onSpeakerClick,
}) => {
  const [editingText, setEditingText] = useState(false);
  const [editText, setEditText] = useState(transcript.text);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    onEdit({ ...transcript, text: editText });
    setEditingText(false);
  };

  return (
    <div
      className={`p-3 rounded-lg transition-colors group ${
        isActive ? 'bg-primary/20' : 'hover:bg-muted/50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge 
          variant="outline"
          className="cursor-pointer hover:bg-primary/20"
          onClick={() => onTimeClick(transcript.start)}
        >
          {formatTimestamp(transcript.start)}
        </Badge>
        
        {transcript.speaker && (
          <Badge 
            style={{ backgroundColor: transcript.speaker.color }}
            className="cursor-pointer"
            onClick={() => onSpeakerClick(transcript)}
          >
            {transcript.speaker.name}
          </Badge>
        )}
        
        <div className="flex-1" />
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onSplit(transcript)}
          className={`${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        >
          <Split className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onAdd(transcript)}
          className={`${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(transcript)}
          className={`${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity text-destructive`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {editingText ? (
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
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditingText(false)}
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
            onClick={() => setEditingText(true)}
            className={`${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};