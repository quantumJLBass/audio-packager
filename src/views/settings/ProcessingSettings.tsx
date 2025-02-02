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
      <Accordion 
        type="single" 
        collapsible 
        className="space-y-2"
      >
        <AccordionItem 
          value="model" 
          className="bg-background border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-2 hover:bg-accent hover:text-accent-foreground">
            Model Settings
          </AccordionTrigger>
          <AccordionContent className="bg-background/50 p-4">
            <ModelSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="sentiment" 
          className="bg-background border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-2 hover:bg-accent hover:text-accent-foreground">
            Sentiment Analysis
          </AccordionTrigger>
          <AccordionContent className="bg-background/50 p-4">
            <SentimentSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="tone" 
          className="bg-background border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-2 hover:bg-accent hover:text-accent-foreground">
            Tone Analysis
          </AccordionTrigger>
          <AccordionContent className="bg-background/50 p-4">
            <ToneSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="speakers" 
          className="bg-background border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-2 hover:bg-accent hover:text-accent-foreground">
            Speaker Settings
          </AccordionTrigger>
          <AccordionContent className="bg-background/50 p-4">
            <SpeakerSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SettingsSection>
  );
};