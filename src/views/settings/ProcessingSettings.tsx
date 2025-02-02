import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SettingsSection } from './SettingsSection';
import { ModelSettings } from './processing/ModelSettings';
import { SentimentSettings } from './processing/SentimentSettings';
import { ToneSettings } from './processing/ToneSettings';
import { SpeakerSettings } from './SpeakerSettings';
import type { AudioSettings } from '@/types/audio/settings';

interface ProcessingSettingsProps {
  settings: AudioSettings;
  onChange: (settings: Partial<AudioSettings>) => void;
}

export const ProcessingSettings: React.FC<ProcessingSettingsProps> = ({
  settings,
  onChange
}) => {
  return (
    <SettingsSection title="Processing Settings">
      <Accordion type="single" collapsible>
        <AccordionItem value="model">
          <AccordionTrigger>Model Settings</AccordionTrigger>
          <AccordionContent>
            <ModelSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sentiment">
          <AccordionTrigger>Sentiment Analysis</AccordionTrigger>
          <AccordionContent>
            <SentimentSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tone">
          <AccordionTrigger>Tone Analysis</AccordionTrigger>
          <AccordionContent>
            <ToneSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="speakers">
          <AccordionTrigger>Speaker Settings</AccordionTrigger>
          <AccordionContent>
            <SpeakerSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SettingsSection>
  );
};