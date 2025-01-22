import React from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ProcessingNodeProps {
  data: {
    label: string;
    type: string;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
  };
}

export const ProcessingNode: React.FC<ProcessingNodeProps> = ({ data }) => {
  return (
    <Card className="w-[250px] glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${data.type}-toggle`}
            checked={data.enabled}
            onCheckedChange={data.onToggle}
          />
          <Label htmlFor={`${data.type}-toggle`}>Enabled</Label>
        </div>
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      </CardContent>
    </Card>
  );
};