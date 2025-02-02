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
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-2 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50">
            Model Settings
          </AccordionTrigger>
          <AccordionContent className="bg-background/5 p-4">
            <ModelSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="sentiment" 
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-2 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50">
            Sentiment Analysis
          </AccordionTrigger>
          <AccordionContent className="bg-background/5 p-4">
            <SentimentSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="tone" 
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-2 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50">
            Tone Analysis
          </AccordionTrigger>
          <AccordionContent className="bg-background/5 p-4">
            <ToneSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="speakers" 
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-2 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50">
            Speaker Settings
          </AccordionTrigger>
          <AccordionContent className="bg-background/5 p-4">
            <SpeakerSettings settings={settings} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SettingsSection>
  );
};