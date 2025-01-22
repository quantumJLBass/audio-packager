import React from 'react';
import { AudioWaveform } from '@/components/AudioWaveform';
import { FileTree } from '@/components/FileTree';
import { ProcessingNode } from '@/components/ProcessingNode';
import ReactFlow, { Background } from 'reactflow';
import 'reactflow/dist/style.css';

const Index = () => {
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [processingOptions, setProcessingOptions] = React.useState({
    transcription: true,
    diarization: true,
    sentiment: true,
    toneAnalysis: true,
  });

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

  const nodes = [
    {
      id: '1',
      type: 'processing',
      position: { x: 250, y: 100 },
      data: {
        label: 'Transcription',
        type: 'transcription',
        enabled: processingOptions.transcription,
        onToggle: (enabled: boolean) =>
          setProcessingOptions(prev => ({ ...prev, transcription: enabled })),
      },
    },
    // Add more nodes for other processing options
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass p-4">
        <h1 className="text-2xl font-bold">Audio Processing Studio</h1>
      </header>
      
      <main className="flex-1 flex gap-4 p-4">
        <aside className="w-64 glass rounded-lg">
          <FileTree
            data={fileTreeData}
            onSelect={(node) => setSelectedFile(node.id)}
            selectedId={selectedFile || undefined}
          />
        </aside>
        
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-[200px] glass rounded-lg p-4">
            <AudioWaveform
              url="/placeholder-audio.mp3"
              onReady={() => console.log('Waveform ready')}
              onTimeUpdate={(time) => console.log('Time update:', time)}
            />
          </div>
          
          <div className="flex-1 glass rounded-lg p-4">
            <ReactFlow
              nodes={nodes}
              nodeTypes={{
                processing: ProcessingNode,
              }}
              fitView
            >
              <Background />
            </ReactFlow>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;