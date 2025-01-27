import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SettingsSection } from './SettingsSection';
import { SettingField } from '@/components/settings/SettingField';
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
              <SettingField
                id="audioSampleRate"
                label="Sample Rate (Hz)"
                tooltip="The number of audio samples per second. Higher values mean better quality but larger file sizes."
              >
                <Input
                  id="audioSampleRate"
                  type="number"
                  value={settings.audioSampleRate}
                  onChange={(e) => onChange({ ...settings, audioSampleRate: Number(e.target.value) })}
                />
              </SettingField>

              <SettingField
                id="fftSize"
                label="FFT Size"
                tooltip="Size of the Fast Fourier Transform window. Larger values give better frequency resolution but worse time resolution."
              >
                <Input
                  id="fftSize"
                  type="number"
                  value={settings.fftSize}
                  onChange={(e) => onChange({ ...settings, fftSize: Number(e.target.value) })}
                />
              </SettingField>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced">
          <AccordionTrigger>Advanced Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <SettingField
                id="minPitchLag"
                label="Minimum Pitch Lag"
                tooltip="Minimum time difference for pitch detection. Lower values allow detection of higher frequencies."
              >
                <Input
                  id="minPitchLag"
                  type="number"
                  value={settings.minPitchLag}
                  onChange={(e) => onChange({ ...settings, minPitchLag: Number(e.target.value) })}
                />
              </SettingField>

              <SettingField
                id="maxPitchLag"
                label="Maximum Pitch Lag"
                tooltip="Maximum time difference for pitch detection. Higher values allow detection of lower frequencies."
              >
                <Input
                  id="maxPitchLag"
                  type="number"
                  value={settings.maxPitchLag}
                  onChange={(e) => onChange({ ...settings, maxPitchLag: Number(e.target.value) })}
                />
              </SettingField>

              <SettingField
                id="onsetThreshold"
                label="Onset Threshold"
                tooltip="Threshold for detecting the start of new sounds. Higher values mean less sensitive detection."
              >
                <Input
                  id="onsetThreshold"
                  type="number"
                  step="0.01"
                  value={settings.onsetThreshold}
                  onChange={(e) => onChange({ ...settings, onsetThreshold: Number(e.target.value) })}
                />
              </SettingField>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="defaults">
          <AccordionTrigger>Default Values</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <SettingField
                id="defaultPitch"
                label="Default Pitch (Hz)"
                tooltip="Default frequency to use when pitch detection fails or is unavailable."
              >
                <Input
                  id="defaultPitch"
                  type="number"
                  value={settings.defaultPitch}
                  onChange={(e) => onChange({ ...settings, defaultPitch: Number(e.target.value) })}
                />
              </SettingField>

              <SettingField
                id="defaultTempo"
                label="Default Tempo (BPM)"
                tooltip="Default tempo to use when tempo detection fails or is unavailable."
              >
                <Input
                  id="defaultTempo"
                  type="number"
                  value={settings.defaultTempo}
                  onChange={(e) => onChange({ ...settings, defaultTempo: Number(e.target.value) })}
                />
              </SettingField>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SettingsSection>
  );
};