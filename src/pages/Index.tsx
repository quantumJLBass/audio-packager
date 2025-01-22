import React from 'react';
import { AudioWaveform } from '@/components/AudioWaveform';
import { FileTree } from '@/components/FileTree';
import { ProcessingFlow } from '@/components/ProcessingFlow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

const Index = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [metadata, setMetadata] = React.useState({
    title: '',
    description: '',
    tags: [] as string[],
  });
  const [processingNodes, setProcessingNodes] = React.useState<Node[]>([
    {
      id: '1',
      type: 'processing',
      position: { x: 250, y: 100 },
      data: {
        label: 'Transcription',
        type: 'transcription',
        enabled: true,
        onToggle: (enabled: boolean) => handleNodeToggle('1', enabled),
      },
    },
    {
      id: '2',
      type: 'processing',
      position: { x: 250, y: 200 },
      data: {
        label: 'Speaker Diarization',
        type: 'diarization',
        enabled: true,
        onToggle: (enabled: boolean) => handleNodeToggle('2', enabled),
      },
    },
    {
      id: '3',
      type: 'processing',
      position: { x: 250, y: 300 },
      data: {
        label: 'Sentiment Analysis',
        type: 'sentiment',
        enabled: true,
        onToggle: (enabled: boolean) => handleNodeToggle('3', enabled),
      },
    },
  ]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  const fileTreeData = [
    {
      id: '1',
      name: 'Project 1',
      type: 'folder' as const,
      children: [
        {
          id: '2',
          name: 'audio1.mp3',
          type: 'file' as const,
        },
      ],
    },
  ];

  const handleNodeToggle = (nodeId: string, enabled: boolean) => {
    setProcessingNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, enabled } }
          : node
      )
    );
    toast({
      title: `${enabled ? 'Enabled' : 'Disabled'} processing node`,
      description: `Node ${nodeId} has been ${enabled ? 'enabled' : 'disabled'}`,
    });
  };

  const handleMetadataChange = (
    field: keyof typeof metadata,
    value: string | string[]
  ) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const handleProcessing = () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to process',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Processing started',
      description: 'Your audio file is being processed',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass p-4">
        <h1 className="text-2xl font-bold">Audio Processing Studio</h1>
      </header>
      
      <main className="flex-1 flex gap-4 p-4">
        <aside className="w-64 flex flex-col gap-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
            </CardHeader>
            <CardContent>
              <FileTree
                data={fileTreeData}
                onSelect={(node) => setSelectedFile(node.id)}
                selectedId={selectedFile || undefined}
              />
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={metadata.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={metadata.description}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </aside>
        
        <div className="flex-1 flex flex-col gap-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Audio Waveform</CardTitle>
            </CardHeader>
            <CardContent>
              <AudioWaveform
                url="/placeholder-audio.mp3"
                onReady={() => console.log('Waveform ready')}
                onTimeUpdate={(time) => console.log('Time update:', time)}
              />
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardHeader>
              <CardTitle>Processing Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ProcessingFlow
                nodes={processingNodes}
                edges={edges}
                onEdgesChange={setEdges}
                onConnect={(params) => {
                  setEdges((eds) => [...eds, { ...params, id: `e${eds.length + 1}` }]);
                }}
              />
            </CardContent>
          </Card>

          <Button
            className="w-full"
            onClick={handleProcessing}
            disabled={!selectedFile}
          >
            Process Audio
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;