import React from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface FileTreeProps {
  data: FileNode[];
  onSelect: (node: FileNode) => void;
  selectedId?: string;
}

export const FileTree: React.FC<FileTreeProps> = ({ data, onSelect, selectedId }) => {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: FileNode, level = 0) => {
    const isExpanded = expanded[node.id];
    const isSelected = node.id === selectedId;

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            "flex items-center py-1 px-2 hover:bg-muted/50 cursor-pointer",
            isSelected && "bg-primary/20"
          )}
          style={{ paddingLeft: `${level * 16}px` }}
          onClick={() => onSelect(node)}
        >
          {node.type === 'folder' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className="p-1 hover:bg-muted/50 rounded"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          {node.type === 'folder' ? (
            <Folder size={16} className="mr-2 text-primary" />
          ) : (
            <File size={16} className="mr-2 text-muted-foreground" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'folder' && isExpanded && node.children?.map(child => 
          renderNode(child, level + 1)
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-auto glass rounded-lg p-2">
      {data.map(node => renderNode(node))}
    </div>
  );
};