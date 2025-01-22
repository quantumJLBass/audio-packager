import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Save, X } from 'lucide-react';
import { Transcription } from '@/types/audio';

interface TranscriptionDisplayProps {
  transcriptions: Transcription[];
  currentTime: number;
  onTranscriptionUpdate?: (updatedTranscription: Transcription) => void;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcriptions,
  currentTime,
  onTranscriptionUpdate
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

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
    if (onTranscriptionUpdate) {
      onTranscriptionUpdate({
        ...transcript,
        text: editText
      });
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <Card className="glass">
      <ScrollArea className="h-[400px] p-4">
        <div className="space-y-4" ref={scrollRef}>
          {transcriptions.map((transcript) => (
            <div
              key={transcript.start}
              id={`transcript-${transcript.start}`}
              className={`p-3 rounded-lg transition-colors ${
                currentTime >= transcript.start && currentTime <= transcript.end
                  ? 'bg-primary/20'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  {new Date(transcript.start * 1000).toISOString().substr(14, 5)}
                </Badge>
                {transcript.speaker && (
                  <Badge 
                    style={{ backgroundColor: transcript.speaker.color }}
                  >
                    {transcript.speaker.name}
                  </Badge>
                )}
              </div>
              
              {editingId === transcript.start ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1"
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
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};