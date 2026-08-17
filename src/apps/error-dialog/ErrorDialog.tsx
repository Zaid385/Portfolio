import { useWindowStore } from '../../stores/window-store';
import { audioManager } from '../../audio/audio-manager';
import { useEffect } from 'react';
import { AssetRegistry } from '../../assets/registry';

interface ErrorDialogProps {
  windowId: string;
  launchArgs?: Record<string, unknown>;
}

export function ErrorDialog({ windowId, launchArgs }: ErrorDialogProps) {
  const closeWindow = useWindowStore(state => state.closeWindow);
  
  const message = (launchArgs?.message as string) || 'An unknown error has occurred.';
  const type = (launchArgs?.type as 'error' | 'info' | 'warning') || 'error';
  const triggerCrash = (launchArgs?.triggerCrash as boolean) || false;

  useEffect(() => {
    if (type === 'error') {
      audioManager.play('error');
    } else {
      audioManager.play('notification');
    }
  }, [type]);

  const handleOk = () => {
    closeWindow(windowId);
    if (triggerCrash) {
      import('../../stores/system-store').then(module => {
        module.useSystemStore.getState().triggerCrash(message.toUpperCase());
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#ece9d8] p-4 select-none">
      <div className="flex flex-row items-start mb-6">
        <div className="mr-4 mt-1">
          {type === 'error' && (
            <img src={AssetRegistry.XP_COMMAND_PROMPT_ICON} alt="Error" className="w-8 h-8" onError={(e) => e.currentTarget.style.display = 'none'} />
          )}
        </div>
        <div className="text-[12px] md:text-[13px] leading-tight font-[Tahoma]">
          {message}
        </div>
      </div>
      
      <div className="mt-auto flex justify-center pb-2">
        <button 
          onClick={handleOk}
          className="px-6 py-1 bg-[#ece9d8] border-2 border-white shadow-[1px_1px_0px_#000,_inset_-1px_-1px_0px_#aca899] active:shadow-[inset_1px_1px_1px_#000] focus:outline-1 focus:outline-dotted focus:outline-black font-[Tahoma] text-[12px]"
        >
          OK
        </button>
      </div>
    </div>
  );
}
