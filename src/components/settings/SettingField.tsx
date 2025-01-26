import React from 'react';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingFieldProps {
  label: string;
  tooltip: string;
  children: React.ReactNode;
  id: string;
}

export const SettingField: React.FC<SettingFieldProps> = ({
  label,
  tooltip,
  children,
  id,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label htmlFor={id}>{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
    </div>
  );
};