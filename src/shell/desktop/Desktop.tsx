import { useState } from 'react';
import { desktopConfig } from '../../registries/desktop-config';
import { DesktopIcon } from './DesktopIcon';
import { AssetRegistry } from '../../assets/registry';
import { useWindowStore } from '../../stores/window-store';

export function Desktop() {
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());

  const handleSelect = (id: string, toggle: boolean) => {
    if (toggle) {
      const newSet = new Set(selectedIcons);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIcons(newSet);
    } else {
      setSelectedIcons(new Set([id]));
    }
  };

  const handleDeselectAll = () => {
    setSelectedIcons(new Set());
  };

  const handleDoubleClick = (appId: string) => {
    useWindowStore.getState().launchApp(appId);
  };

  return (
    <div 
      className="w-full h-full bg-cover bg-center bg-no-repeat overflow-hidden relative"
      style={{ backgroundImage: `url(${AssetRegistry.XP_BLISS_WALLPAPER})` }}
      onClick={handleDeselectAll}
    >
      <div className="absolute inset-0 pb-[40px] p-2 flex flex-col flex-wrap content-start items-start gap-y-4 gap-x-2">
        {desktopConfig
          .sort((a, b) => a.order - b.order)
          .map((config) => (
            <DesktopIcon
              key={config.id}
              config={config}
              isSelected={selectedIcons.has(config.id)}
              onSelect={handleSelect}
              onDoubleClick={handleDoubleClick}
            />
          ))}
      </div>
    </div>
  );
}
