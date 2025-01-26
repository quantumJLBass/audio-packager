import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect }) => {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploading(true);
    setUploadedFile(file);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    onFileSelect(file);
    setIsUploading(false);
    
    toast({
      title: "File uploaded successfully",
      description: `${file.name} is ready for processing`,
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
      {uploadedFile ? (
        <div className="flex items-center gap-2">
          <Check className="w-6 h-6 text-green-500" />
          <span className="text-sm font-medium">{uploadedFile.name}</span>
        </div>
      ) : (
        <Upload className="w-12 h-12 text-muted-foreground" />
      )}
      
      {isUploading ? (
        <div className="w-full space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-center text-muted-foreground">
            Uploading... {uploadProgress}%
          </p>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => inputRef.current?.click()}
        >
          {uploadedFile ? 'Select Different File' : 'Select Audio File'}
        </Button>
      )}
      
      <p className="text-sm text-muted-foreground">
        Supported formats: MP3, WAV, M4A
      </p>
    </div>
  );
};