import type { DesktopIconConfig } from '../../registries/desktop-config';

interface DesktopIconProps {
  config: DesktopIconConfig;
  isSelected: boolean;
  onSelect: (id: string, toggle: boolean) => void;
  onDoubleClick: (id: string) => void;
}

export function DesktopIcon({ config, isSelected, onSelect, onDoubleClick }: DesktopIconProps) {
  return (
    <div 
      className="w-[74px] flex flex-col items-center group cursor-default"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(config.id, e.ctrlKey || e.metaKey);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(config.id);
      }}
    >
      <div className={`p-1 ${isSelected ? 'xp-icon-selected' : ''}`}>
        <img 
          src={config.icon} 
          alt={config.label} 
          className="w-8 h-8 object-contain drop-shadow-md mx-auto pointer-events-none select-none"
        />
      </div>
      <div 
        className={`mt-1 text-center leading-tight px-1 py-[2px] border ${
          isSelected 
            ? 'bg-[#0B61FF] text-white border-transparent opacity-90' 
            : 'text-white border-transparent text-shadow-xp hover:opacity-90'
        }`}
        style={{
          fontSize: '11px',
          wordBreak: 'break-word',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {config.label}
      </div>
    </div>
  );
}
