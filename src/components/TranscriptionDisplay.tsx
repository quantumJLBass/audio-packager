import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transcription } from '@/types/audio';

interface TranscriptionDisplayProps {
  transcriptions: Transcription[];
  currentTime: number;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcriptions,
  currentTime,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const activeTranscript = transcriptions.find(
      t => currentTime >= t.start && currentTime <= t.end
    );
    
    if (activeTranscript) {
      const element = document.getElementById(`transcript-${activeTranscript.start}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime, transcriptions]);

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
              <p className="text-sm">{transcript.text}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};