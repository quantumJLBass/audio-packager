import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SettingsSection } from './SettingsSection';
import type { AudioSettings as AudioSettingsType } from '@/utils/settings';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AudioSettingsProps {
  settings: AudioSettingsType;
  onChange: (settings: AudioSettingsType) => void;
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({
  settings,
  onChange
}) => {
  return (
    <SettingsSection title="Audio Settings">
      <Accordion type="single" collapsible>
        <AccordionItem value="basic">
          <AccordionTrigger>Basic Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audioSampleRate">Sample Rate (Hz)</Label>
                <Input
                  id="audioSampleRate"
                  type="number"
                  value={settings.audioSampleRate}
                  onChange={(e) => onChange({ ...settings, audioSampleRate: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fftSize">FFT Size</Label>
                <Input
                  id="fftSize"
                  type="number"
                  value={settings.fftSize}
                  onChange={(e) => onChange({ ...settings, fftSize: Number(e.target.value) })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced">
          <AccordionTrigger>Advanced Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minPitchLag">Minimum Pitch Lag</Label>
                <Input
                  id="minPitchLag"
                  type="number"
                  value={settings.minPitchLag}
                  onChange={(e) => onChange({ ...settings, minPitchLag: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPitchLag">Maximum Pitch Lag</Label>
                <Input
                  id="maxPitchLag"
                  type="number"
                  value={settings.maxPitchLag}
                  onChange={(e) => onChange({ ...settings, maxPitchLag: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="onsetThreshold">Onset Threshold</Label>
                <Input
                  id="onsetThreshold"
                  type="number"
                  step="0.01"
                  value={settings.onsetThreshold}
                  onChange={(e) => onChange({ ...settings, onsetThreshold: Number(e.target.value) })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="defaults">
          <AccordionTrigger>Default Values</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultPitch">Default Pitch (Hz)</Label>
                <Input
                  id="defaultPitch"
                  type="number"
                  value={settings.defaultPitch}
                  onChange={(e) => onChange({ ...settings, defaultPitch: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultTempo">Default Tempo (BPM)</Label>
                <Input
                  id="defaultTempo"
                  type="number"
                  value={settings.defaultTempo}
                  onChange={(e) => onChange({ ...settings, defaultTempo: Number(e.target.value) })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SettingsSection>
  );
};