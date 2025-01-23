import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  isReady: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange: (value: number) => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  isReady,
  onZoomIn,
  onZoomOut,
  onZoomChange
}) => {
  const [editingZoom, setEditingZoom] = React.useState(false);
  const [zoomValue, setZoomValue] = React.useState(zoom.toString());

  const handleZoomBlur = () => {
    const newZoom = Math.min(Math.max(parseInt(zoomValue) || 20, 20), 100);
    onZoomChange(newZoom);
    setEditingZoom(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        className="hover:bg-primary/20"
        disabled={!isReady}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      {editingZoom ? (
        <Input
          type="number"
          value={zoomValue}
          onChange={(e) => setZoomValue(e.target.value)}
          onBlur={handleZoomBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleZoomBlur()}
          className="w-16 text-center"
          min={20}
          max={100}
          autoFocus
        />
      ) : (
        <div 
          className="w-12 text-center cursor-pointer hover:bg-primary/10 rounded px-2"
          onClick={() => setEditingZoom(true)}
        >
          <span className="text-sm font-mono">{zoom}%</span>
        </div>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        className="hover:bg-primary/20"
        disabled={!isReady}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};