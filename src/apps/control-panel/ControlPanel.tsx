import { useSystemStore } from '../../stores/system-store';

interface ControlPanelProps {
  windowId: string;
}

export function ControlPanel({ windowId: _windowId }: ControlPanelProps) {
  const store = useSystemStore();

  return (
    <div className="flex w-full h-full bg-white text-black text-sm select-none">
      {/* Left Sidebar */}
      <div className="w-[180px] bg-gradient-to-b from-[#6695e2] to-[#3a58b6] flex flex-col p-4 shadow-[inset_-1px_0_3px_rgba(0,0,0,0.2)] text-white">
        <h2 className="text-xl font-bold font-['Tahoma'] drop-shadow-md mb-2">Control Panel</h2>
        <p className="text-xs mb-4">Adjust your simulated computer's settings.</p>
        <div className="border-t border-white/30 pt-4 mt-2">
           <h3 className="font-bold text-sm text-yellow-300 mb-1">See Also</h3>
           <ul className="text-xs space-y-1 mt-2 underline cursor-pointer text-white">
             <li>Windows Update</li>
             <li>Help and Support</li>
           </ul>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-auto p-6 bg-white space-y-8 font-['Tahoma']">
        
        {/* Display Settings */}
        <section>
          <div className="flex items-center space-x-2 border-b border-[#0ea0ed] pb-1 mb-4">
            <span className="font-bold text-[#003399] text-base">Display & Appearance</span>
          </div>
          <div className="ml-4 space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Screen Brightness</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="range" min="0" max="100" 
                  value={store.brightness} 
                  onChange={(e) => store.setBrightness(Number(e.target.value))}
                  className="w-48 accent-[#245edb] cursor-pointer"
                />
                <span className="text-xs">{store.brightness}%</span>
              </div>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={store.animationsEnabled} 
                  onChange={(e) => store.setAnimationsEnabled(e.target.checked)} 
                />
                <span className="text-xs font-bold">Enable system animations</span>
              </label>
              <p className="text-[10px] text-gray-500 ml-5 mt-1">If disabled, reduces motion throughout the simulated OS.</p>
            </div>
          </div>
        </section>

        {/* Audio Settings */}
        <section>
          <div className="flex items-center space-x-2 border-b border-[#0ea0ed] pb-1 mb-4">
            <span className="font-bold text-[#003399] text-base">Sounds & Audio Devices</span>
          </div>
          <div className="ml-4 space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">System Volume</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="range" min="0" max="100" 
                  value={store.volume} 
                  onChange={(e) => store.setVolume(Number(e.target.value))}
                  className="w-48 accent-[#245edb] cursor-pointer"
                />
                <span className="text-xs">{store.volume}%</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={store.isMuted} 
                  onChange={store.toggleMute} 
                />
                <span className="text-xs font-bold">Mute all sounds</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={store.soundEffectsEnabled} 
                  onChange={(e) => store.setSoundEffectsEnabled(e.target.checked)} 
                />
                <span className="text-xs font-bold">Enable sound effects</span>
              </label>
            </div>
          </div>
        </section>

        {/* Network & Devices */}
        <section>
          <div className="flex items-center space-x-2 border-b border-[#0ea0ed] pb-1 mb-4">
            <span className="font-bold text-[#003399] text-base">Network & Devices</span>
          </div>
          <div className="ml-4 space-y-4">
            <div className="flex items-center space-x-6">
              <button 
                className="px-4 py-1 border border-gray-400 rounded bg-[#ece9d8] hover:bg-[#d8d4c4] active:bg-[#c4c0ae] text-xs shadow-sm flex items-center space-x-2"
                onClick={store.toggleWifi}
              >
                <span>Wi-Fi:</span>
                <span className={store.wifiEnabled ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                  {store.wifiEnabled ? 'Connected' : 'Disabled'}
                </span>
              </button>
              
              <button 
                className="px-4 py-1 border border-gray-400 rounded bg-[#ece9d8] hover:bg-[#d8d4c4] active:bg-[#c4c0ae] text-xs shadow-sm flex items-center space-x-2"
                onClick={store.toggleBluetooth}
              >
                <span>Bluetooth:</span>
                <span className={store.bluetoothEnabled ? 'text-blue-600 font-bold' : 'text-gray-500 font-bold'}>
                  {store.bluetoothEnabled ? 'On' : 'Off'}
                </span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
