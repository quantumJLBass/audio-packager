import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioUploader } from '@/components/AudioUploader';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { SettingField } from '@/components/settings/SettingField';
import { getSettings } from '@/utils/settings';

interface OutletContext {
  onFileSelect: (file: File) => void;
}

export const AudioUploadForm = () => {
  const { onFileSelect } = useOutletContext<OutletContext>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [packageName, setPackageName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoProcess, setAutoProcess] = useState(false);
  const settings = getSettings();
  const [options, setOptions] = useState({
    model: settings.defaultModel,
    language: settings.defaultLanguage,
    floatingPoint: settings.defaultFloatingPoint,
    diarization: true,
    chunkLength: settings.defaultChunkLength,
    strideLength: settings.defaultStrideLength,
  });
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPackageName(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
    if (autoProcess) {
      handleSubmit();
    }
    onFileSelect(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }
    onFileSelect(selectedFile);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Audio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AudioUploader onFileSelect={handleFileSelect} />
            
            <SettingField
              id="packageName"
              label="Package Name"
              tooltip="Name for this audio processing package. This will be used to identify the processed results."
            >
              <Input
                id="packageName"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="Enter package name"
              />
            </SettingField>

            <SettingField
              id="autoProcess"
              label="Auto-process on Upload"
              tooltip="Automatically start processing when a file is uploaded"
            >
              <Switch
                checked={autoProcess}
                onCheckedChange={setAutoProcess}
              />
            </SettingField>

            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  Advanced Options <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <SettingField
                  id="model"
                  label="Model"
                  tooltip="Select the AI model to use for audio processing. Larger models are more accurate but slower."
                >
                  <Select
                    value={options.model}
                    onValueChange={(value) => setOptions({ ...options, model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.supportedModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SettingField>

                <SettingField
                  id="language"
                  label="Language"
                  tooltip="Select the primary language of the audio. Auto-detect works well for most cases."
                >
                  <Select
                    value={options.language}
                    onValueChange={(value) => setOptions({ ...options, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.supportedLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SettingField>

                <SettingField
                  id="floatingPoint"
                  label="Floating Point"
                  tooltip="Precision level for audio processing. Higher precision (32-bit) is more accurate but uses more memory."
                >
                  <Select
                    value={options.floatingPoint.toString()}
                    onValueChange={(value) => setOptions({ ...options, floatingPoint: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select precision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16">16-bit</SelectItem>
                      <SelectItem value="32">32-bit</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingField>

                <SettingField
                  id="chunkLength"
                  label="Chunk Length (seconds)"
                  tooltip="Length of audio segments for processing. Longer chunks are more accurate but use more memory."
                >
                  <Input
                    id="chunkLength"
                    type="number"
                    value={options.chunkLength}
                    onChange={(e) => setOptions({ ...options, chunkLength: parseInt(e.target.value) })}
                    min={1}
                    max={60}
                  />
                </SettingField>

                <SettingField
                  id="strideLength"
                  label="Stride Length (seconds)"
                  tooltip="Overlap between audio chunks. Longer stride helps maintain context between chunks."
                >
                  <Input
                    id="strideLength"
                    type="number"
                    value={options.strideLength}
                    onChange={(e) => setOptions({ ...options, strideLength: parseInt(e.target.value) })}
                    min={1}
                    max={30}
                  />
                </SettingField>
              </CollapsibleContent>
            </Collapsible>

            <Button type="submit" className="w-full">
              Process Audio
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};