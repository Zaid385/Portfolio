import { useState, useEffect } from 'react';
import { useSystemStore } from '../../stores/system-store';

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
      <div 
        className="w-4 h-4 cursor-pointer flex items-center justify-center relative group"
        onClick={toggleBluetooth}
        title={bluetoothEnabled ? "Bluetooth: On" : "Bluetooth: Off"}
      >
        <span className={`text-[10px] font-bold ${bluetoothEnabled ? 'text-[#000080]' : 'text-gray-200 opacity-50'}`}>B</span>
      </div>

      {/* Wi-Fi */}
      <div 
        className="w-4 h-4 cursor-pointer flex items-center justify-center relative group"
        onClick={toggleWifi}
        title={wifiEnabled ? "Wi-Fi: Connected" : "Wi-Fi: Disconnected"}
      >
        {wifiEnabled ? (
          <div className="flex items-end space-x-[1px] h-3">
            <div className="w-[2px] h-[4px] bg-[#00ff00]"></div>
            <div className="w-[2px] h-[6px] bg-[#00ff00]"></div>
            <div className="w-[2px] h-[8px] bg-[#00ff00]"></div>
            <div className="w-[2px] h-[10px] bg-[#00ff00]"></div>
          </div>
        ) : (
          <span className="text-[12px] text-red-500 font-bold leading-none select-none">X</span>
        )}
      </div>

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
        <div 
          className="w-4 h-4 cursor-pointer flex items-center justify-center font-bold text-yellow-300 text-sm leading-none"
          onClick={() => { setShowBrightness(!showBrightness); setShowVolume(false); }}
          title={`Brightness: ${brightness}%`}
        >
          ☼
        </div>
        {showBrightness && (
          <div className="absolute bottom-[30px] right-0 bg-[#ece9d8] border border-[#716f64] p-2 flex flex-col items-center z-50 shadow-md">
            <span className="text-black text-xs mb-1">Brightness</span>
            <input 
              type="range" min="0" max="100" value={brightness} 
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-24 h-1 cursor-pointer accent-[#245edb]"
            />
          </div>
        )}
      </div>

      {/* Volume */}
      <div className="relative">
        <div 
          className="w-4 h-4 cursor-pointer flex items-center justify-center"
          onClick={() => { setShowVolume(!showVolume); setShowBrightness(false); }}
          title={isMuted || volume === 0 ? "Volume: Muted" : `Volume: ${volume}%`}
        >
          <span className={`text-xs font-bold leading-none ${isMuted || volume === 0 ? 'text-red-400' : 'text-white'}`}>
            {isMuted || volume === 0 ? '✕' : '♪'}
          </span>
        </div>
        {showVolume && (
          <div className="absolute bottom-[30px] right-0 bg-[#ece9d8] border border-[#716f64] p-2 flex flex-col items-center z-50 shadow-md">
            <span className="text-black text-xs mb-1">Volume</span>
            <input 
              type="range" min="0" max="100" value={volume} 
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 h-1 cursor-pointer mb-2 accent-[#245edb]"
            />
            <label className="text-black text-xs flex items-center space-x-1 cursor-pointer">
              <input type="checkbox" checked={isMuted} onChange={toggleMute} />
              <span>Mute</span>
            </label>
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
