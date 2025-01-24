import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Split, Plus, Trash2, Pencil } from 'lucide-react';
import { Transcription } from '@/types/audio';

interface TranscriptionControlsProps {
  transcript: Transcription;
  isHovered: boolean;
  onSplit: () => void;
  onAdd: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onTimeClick: () => void;
  onSpeakerClick: () => void;
}

export const TranscriptionControls: React.FC<TranscriptionControlsProps> = ({
  transcript,
  isHovered,
  onSplit,
  onAdd,
  onDelete,
  onEdit,
  onTimeClick,
  onSpeakerClick,
}) => {
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <Badge 
        variant="outline"
        className="cursor-pointer hover:bg-primary/20"
        onClick={onTimeClick}
      >
        {formatTime(transcript.start)}
      </Badge>
      
      {transcript.speaker && (
        <Badge 
          style={{ backgroundColor: transcript.speaker.color }}
          className="cursor-pointer"
          onClick={onSpeakerClick}
        >
          {transcript.speaker.name}
        </Badge>
      )}
      
      <div className="flex-1" />
      
      <Button
        size="icon"
        variant="ghost"
        onClick={onSplit}
        className={`${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
      >
        <Split className="h-4 w-4" />
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={onAdd}
        className={`${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={onDelete}
        className={`${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity text-destructive`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={onEdit}
        className={`${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
};