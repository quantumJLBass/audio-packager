import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Speaker } from '@/types/audio';

interface SpeakerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  speaker: Speaker;
  onSave: (name: string, updateAll: boolean) => void;
}

export const SpeakerDialog: React.FC<SpeakerDialogProps> = ({
  isOpen,
  onClose,
  speaker,
  onSave,
}) => {
  const [name, setName] = React.useState(speaker.name);
  const [updateAll, setUpdateAll] = React.useState(true);

  const handleSave = () => {
    onSave(name, updateAll);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Speaker</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Speaker Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="updateAll"
              checked={updateAll}
              onCheckedChange={(checked) => setUpdateAll(checked as boolean)}
            />
            <Label htmlFor="updateAll">
              Update all occurrences of "{speaker.name}"
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};