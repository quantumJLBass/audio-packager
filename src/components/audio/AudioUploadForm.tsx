import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioUploader } from '@/components/AudioUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface AudioUploadFormProps {
  onFileSelect: (file: File, options: AudioProcessingOptions) => void;
}

interface AudioProcessingOptions {
  model: string;
  language: string;
  floatingPoint: number;
  diarization: boolean;
  chunkLength: number;
  strideLength: number;
}

export const AudioUploadForm: React.FC<AudioUploadFormProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [packageName, setPackageName] = useState('');
  const [options, setOptions] = useState<AudioProcessingOptions>({
    model: 'whisper-large-v3',
    language: 'auto',
    floatingPoint: 32,
    diarization: true,
    chunkLength: 30,
    strideLength: 5,
  });
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPackageName(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }
    onFileSelect(selectedFile, options);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <AudioUploader onFileSelect={handleFileSelect} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="packageName">Package Name</Label>
              <Input
                id="packageName"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="Enter package name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={options.model}
                onValueChange={(value) => setOptions({ ...options, model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whisper-large-v3">Whisper Large v3</SelectItem>
                  <SelectItem value="whisper-medium">Whisper Medium</SelectItem>
                  <SelectItem value="whisper-small">Whisper Small</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={options.language}
                onValueChange={(value) => setOptions({ ...options, language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto Detect</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  {/* Add more languages as needed */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="floatingPoint">Floating Point</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="chunkLength">Chunk Length (seconds)</Label>
              <Input
                id="chunkLength"
                type="number"
                value={options.chunkLength}
                onChange={(e) => setOptions({ ...options, chunkLength: parseInt(e.target.value) })}
                min={1}
                max={60}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strideLength">Stride Length (seconds)</Label>
              <Input
                id="strideLength"
                type="number"
                value={options.strideLength}
                onChange={(e) => setOptions({ ...options, strideLength: parseInt(e.target.value) })}
                min={1}
                max={30}
              />
            </div>

            <Button type="submit" className="w-full">
              Process Audio
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};