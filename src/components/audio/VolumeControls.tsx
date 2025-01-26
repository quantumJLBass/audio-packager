import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';
import { getSettings } from '@/utils/settings';

interface VolumeControlsProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
  onMute: () => void;
}

export const VolumeControls: React.FC<VolumeControlsProps> = ({
  volume,
  onVolumeChange,
  onMute,
}) => {
  const settings = getSettings();
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMute}
        className="hover:bg-primary/20"
      >
        {volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      
      <div className="w-24">
        <Slider
          value={[volume]}
          min={settings.minVolume}
          max={settings.maxVolume}
          step={settings.volumeStep}
          onValueChange={onVolumeChange}
        />
      </div>
    </div>
  );
};