import { useState } from 'react';
import { useWindowStore } from '../../stores/window-store';
import { virtualFs, getFsPath, type FsNode } from '../../registries/virtual-fs';
import { AssetRegistry } from '../../assets/registry';

interface FileExplorerProps {
  initialNodeId?: string;
  windowId: string; // so we can update title/icon dynamically if needed, but not required yet
}

export function FileExplorer({ initialNodeId = 'root' }: FileExplorerProps) {
  const [history, setHistory] = useState<string[]>([initialNodeId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const currentNodeId = history[currentIndex];
  const currentNode = virtualFs.nodesById[currentNodeId];

  const handleNavigate = (nodeId: string) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(nodeId);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setSelectedId(null);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedId(null);
    }
  };

  const handleForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedId(null);
    }
  };

  const handleUp = () => {
    if (currentNode && currentNode.parentId) {
      handleNavigate(currentNode.parentId);
    }
  };

  const handleDoubleClick = (node: FsNode) => {
    if (node.type === 'folder') {
      handleNavigate(node.id);
    } else if (node.type === 'file' || node.type === 'app-link') {
      const appId = node.type === 'file' ? node.openAppId : node.appId;
      useWindowStore.getState().launchApp(appId, node.launchArgs);
    }
  };

  if (!currentNode) {
    return <div className="p-4 text-red-500 font-bold">Error: Path not found</div>;
  }

  const children = currentNode.type === 'folder' 
    ? currentNode.childIds.map(id => virtualFs.nodesById[id]).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col w-full h-full bg-[#f1f1f1] text-black text-sm select-none">
      {/* Toolbar */}
      <div className="flex items-center p-1 border-b border-[#d4d0c8] space-x-1 bg-[#ece9d8]">
        <button 
          className={`flex items-center px-2 py-1 border border-transparent rounded hover:border-gray-300 hover:shadow-sm ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          <span className="mr-1 text-green-600 font-bold">←</span> Back
        </button>
        <button 
          className={`flex items-center px-2 py-1 border border-transparent rounded hover:border-gray-300 hover:shadow-sm ${currentIndex === history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleForward}
          disabled={currentIndex === history.length - 1}
        >
          <span className="mr-1 text-green-600 font-bold">→</span> Forward
        </button>
        <button 
          className={`flex items-center px-2 py-1 border border-transparent rounded hover:border-gray-300 hover:shadow-sm ${!currentNode.parentId ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleUp}
          disabled={!currentNode.parentId}
        >
          <span className="mr-1 text-blue-600 font-bold">↑</span> Up
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center px-2 py-1 border-b border-[#d4d0c8] bg-[#ece9d8]">
        <span className="text-gray-500 mr-2">Address</span>
        <div className="flex-1 bg-white border border-gray-400 px-2 py-[2px] flex items-center shadow-inner">
          <img src={AssetRegistry.XP_MY_COMPUTER_ICON} className="w-4 h-4 mr-2 opacity-70" alt="" />
          <span className="truncate">{getFsPath(currentNode.id)}</span>
        </div>
      </div>

      {/* Content Pane */}
      <div 
        className="flex-1 bg-white overflow-auto p-4 flex content-start items-start gap-4 flex-wrap"
        onClick={() => setSelectedId(null)}
      >
        {children.length === 0 && (
          <div className="text-gray-400 italic w-full text-center mt-4">This folder is empty.</div>
        )}
        
        {children.map(child => {
          // Determine icon
          let icon = AssetRegistry.XP_NOTEPAD_ICON;
          if (child.type === 'folder') {
            icon = AssetRegistry.XP_FOLDER_ICON; 
          } else if ('icon' in child && child.icon) {
            icon = child.icon;
          }

          const isSelected = selectedId === child.id;

          return (
            <div
              key={child.id}
              role="button"
              tabIndex={0}
              aria-label={child.name}
              aria-selected={isSelected}
              className="flex flex-col items-center justify-start w-[80px] p-1 cursor-default group focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-dotted"
              onClick={(e) => { e.stopPropagation(); setSelectedId(child.id); }}
              onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(child); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  handleDoubleClick(child);
                } else if (e.key === ' ' || e.key === 'Spacebar') {
                  e.stopPropagation();
                  e.preventDefault();
                  setSelectedId(child.id);
                }
              }}
            >
              <div className={`relative p-1 ${isSelected ? 'xp-icon-selected' : ''}`}>
                <img src={icon} className="w-8 h-8 object-contain drop-shadow-md mx-auto pointer-events-none" alt="" />
              </div>
              <span 
                className={`mt-1 text-center leading-tight line-clamp-3 break-words px-1 text-xs ${
                  isSelected ? 'bg-[#0b61ff] text-white' : 'text-black group-hover:bg-[#0b61ff] group-hover:text-white'
                }`}
              >
                {child.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
