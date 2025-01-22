import React from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection 
} from 'reactflow';
import { ProcessingNode } from './ProcessingNode';
import { toast } from '@/hooks/use-toast';

const nodeTypes = {
  processing: ProcessingNode,
};

interface ProcessingFlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onConnect?: (connection: Connection) => void;
}

export const ProcessingFlow: React.FC<ProcessingFlowProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}) => {
  const handleConnect = (params: Connection) => {
    onConnect?.(params);
    toast({
      title: "Connection established",
      description: "Processing nodes connected successfully",
    });
  };

  return (
    <div className="w-full h-[600px] glass rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) => onNodesChange?.(changes)}
        onEdgesChange={(changes) => onEdgesChange?.(changes)}
        onConnect={handleConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};