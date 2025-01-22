import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect }) => {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file",
        variant: "destructive",
      });
      return;
    }

    onFileSelect(file);
    toast({
      title: "File selected",
      description: `${file.name} has been selected`,
    });
  }, [onFileSelect, toast]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg border-border">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="audio/*"
        className="hidden"
      />
      <Upload className="w-12 h-12 text-muted-foreground" />
      <Button 
        variant="outline" 
        onClick={() => inputRef.current?.click()}
      >
        Select Audio File
      </Button>
      <p className="text-sm text-muted-foreground">
        Supported formats: MP3, WAV, M4A
      </p>
    </div>
  );
};