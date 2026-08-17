import { useState, useEffect } from 'react';
import { useSystemStore } from '../../stores/system-store';
import { AssetRegistry } from '../../assets/registry';

export function SystemTray() {
  const { 
    wifiEnabled, toggleWifi, 
    bluetoothEnabled, toggleBluetooth,
    batteryState, batteryLevel,
    volume, isMuted, setVolume, toggleMute,
    brightness, setBrightness
  } = useSystemStore();

  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [showVolume, setShowVolume] = useState(false);
  const [showBrightness, setShowBrightness] = useState(false);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-full flex items-center bg-[#0ea0ed] bg-gradient-to-b from-[#0ea0ed] via-[#33b8fb] to-[#0ea0ed] border-l border-[#003399] px-2 shadow-[inset_1px_0_0_rgba(255,255,255,0.4)] space-x-2 text-white relative flex-shrink-0">
      
      {/* Bluetooth */}
      <button 
        aria-label={bluetoothEnabled ? "Bluetooth: On" : "Bluetooth: Off"}
        className="w-5 h-5 cursor-pointer flex items-center justify-center relative group"
        onClick={toggleBluetooth}
        title={bluetoothEnabled ? "Bluetooth: On" : "Bluetooth: Off"}
      >
        <img 
          src={AssetRegistry.ICON_BLUETOOTH} 
          className={`w-full h-full object-contain ${!bluetoothEnabled && 'grayscale opacity-50'}`} 
          alt="Bluetooth" 
        />
      </button>

      {/* Wi-Fi */}
      <button 
        aria-label={wifiEnabled ? "Wi-Fi: Connected" : "Wi-Fi: Disconnected"}
        className="w-5 h-5 cursor-pointer flex items-center justify-center relative group"
        onClick={toggleWifi}
        title={wifiEnabled ? "Wi-Fi: Connected" : "Wi-Fi: Disconnected"}
      >
        <img 
          src={AssetRegistry.ICON_WIFI} 
          className={`w-full h-full object-contain ${!wifiEnabled && 'grayscale opacity-50'}`} 
          alt="Wi-Fi" 
        />
      </button>

      {/* Battery */}
      <div 
        className="w-4 h-4 cursor-default flex items-center justify-center relative group mx-1"
        title={`Battery: ${batteryLevel}% Available (${batteryState})`}
      >
        <div className="w-3 h-2 border border-white rounded-[1px] relative flex items-center">
           <div className="w-[1px] h-1 bg-white absolute -right-[2px]" />
           <div className="h-full bg-[#00ff00]" style={{ width: `${batteryLevel}%` }} />
        </div>
      </div>

      {/* Brightness */}
      <div className="relative">
        <button 
          aria-label={`Brightness: ${brightness}%`}
          aria-haspopup="dialog"
          className="w-6 h-6 cursor-pointer flex items-center justify-center font-bold text-yellow-300 text-2xl leading-none pt-[2px]"
          onClick={() => { setShowBrightness(!showBrightness); setShowVolume(false); }}
          title={`Brightness: ${brightness}%`}
        >
          ☼
        </button>
        {showBrightness && (
          <div className="xp-slider-popup">
            <span className="text-black text-[11px] mb-2 font-['Tahoma']">Brightness</span>
            <div className="xp-slider-container">
              <input 
                type="range" min="0" max="100" value={brightness} 
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="xp-vertical-slider"
              />
            </div>
          </div>
        )}
      </div>

      {/* Volume */}
      <div className="relative">
        <button 
          aria-label={isMuted || volume === 0 ? "Volume: Muted" : `Volume: ${volume}%`}
          aria-haspopup="dialog"
          className="w-6 h-6 cursor-pointer flex items-center justify-center pt-[1px]"
          onClick={() => { setShowVolume(!showVolume); setShowBrightness(false); }}
          title={isMuted || volume === 0 ? "Volume: Muted" : `Volume: ${volume}%`}
        >
          <span className={`text-2xl font-bold leading-none ${isMuted || volume === 0 ? 'text-red-400' : 'text-white'}`}>
            {isMuted || volume === 0 ? '✕' : '♪'}
          </span>
        </button>
        {showVolume && (
          <div className="xp-slider-popup">
            <span className="text-black text-[11px] mb-2 font-['Tahoma']">Volume</span>
            <div className="xp-slider-container">
              <input 
                type="range" min="0" max="100" value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))}
                className="xp-vertical-slider"
              />
            </div>
            <div className="mt-3 flex items-center space-x-1">
              <input type="checkbox" checked={isMuted} onChange={toggleMute} className="w-3 h-3 border-gray-400 bg-white" />
              <span className="text-black text-[11px] font-['Tahoma'] select-none">Mute</span>
            </div>
          </div>
        )}
      </div>

      {/* Clock */}
      <div className="text-xs font-['Tahoma'] drop-shadow-md ml-1 pl-2 cursor-default select-none">
        {formattedTime}
      </div>
      
    </div>
  );
}
