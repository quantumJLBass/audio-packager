import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProcessingState } from '@/types/audio/processing';
import { PlaybackControls } from './PlaybackControls';

interface AudioProcessingControlsProps extends ProcessingState {
  onPlayPause: () => void;
}

export const AudioProcessingControls: React.FC<AudioProcessingControlsProps> = ({
  isPlaying,
  isReady,
  currentTime,
  duration,
  onPlayPause,
  isTranscribing
}) => {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>
          Audio Controls
          {isTranscribing && (
            <span className="ml-2 text-sm text-muted-foreground">
              (Processing...)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PlaybackControls
          isPlaying={isPlaying}
          isReady={isReady}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={onPlayPause}
        />
      </CardContent>
    </Card>
  );
};