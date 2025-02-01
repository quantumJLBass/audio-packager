import React from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SentimentMetrics } from '@/types/audio/settings';

interface SentimentThresholdMatrixProps {
  thresholds: {
    [emotion: string]: SentimentMetrics;
  };
  onChange: (thresholds: { [emotion: string]: SentimentMetrics }) => void;
}

export const SentimentThresholdMatrix: React.FC<SentimentThresholdMatrixProps> = ({
  thresholds,
  onChange
}) => {
  const handleValueChange = (emotion: string, field: keyof SentimentMetrics, value: number) => {
    const newThresholds = {
      ...thresholds,
      [emotion]: {
        ...thresholds[emotion],
        [field]: value
      }
    };
    onChange(newThresholds);
  };

  return (
    <div className="border rounded-lg">
      <ScrollArea className="h-[700px]">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[200px]">Emotion</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Precision</TableHead>
              <TableHead>Recall</TableHead>
              <TableHead>F1</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(thresholds).map(([emotion, metrics]) => (
              <TableRow key={emotion}>
                <TableCell className="font-medium">{emotion}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={metrics.value}
                    onChange={(e) => handleValueChange(emotion, 'value', Number(e.target.value))}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={metrics.precision}
                    onChange={(e) => handleValueChange(emotion, 'precision', Number(e.target.value))}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={metrics.recall}
                    onChange={(e) => handleValueChange(emotion, 'recall', Number(e.target.value))}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={metrics.f1}
                    onChange={(e) => handleValueChange(emotion, 'f1', Number(e.target.value))}
                    className="w-24"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};