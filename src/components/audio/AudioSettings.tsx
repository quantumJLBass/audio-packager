import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AudioSettingsProps {
  onSettingsSave: (settings: { huggingFaceToken: string }) => void;
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({ onSettingsSave }) => {
  const [huggingFaceToken, setHuggingFaceToken] = React.useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSettingsSave({ huggingFaceToken });
    toast({
      title: "Settings saved",
      description: "Your HuggingFace token has been saved",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Processing Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="huggingface-token">HuggingFace Token</Label>
            <Input
              id="huggingface-token"
              type="password"
              value={huggingFaceToken}
              onChange={(e) => setHuggingFaceToken(e.target.value)}
              placeholder="Enter your HuggingFace token"
            />
            <p className="text-sm text-muted-foreground">
              Get your token from the <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">HuggingFace settings page</a>
            </p>
          </div>
          <Button type="submit">Save Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
};