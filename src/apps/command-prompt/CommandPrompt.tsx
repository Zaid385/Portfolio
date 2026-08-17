import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useWindowStore } from '../../stores/window-store';
import { virtualFs, getFsPath } from '../../registries/virtual-fs';
import { parseAndExecute } from './command-registry';
import type { CommandContext } from './types';

interface CommandPromptProps {
  windowId: string;
}

interface ScrollbackLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'banner';
  text: string;
}

const ASCII_BANNER = `
  ______    __    __   _______ 
 |__  / |  /  \\  |  | |       \\
   / /  | / /\\ \\ |  | |  .--.  |
  / /_  |/ ____ \\|  | |  |  |  |
 /____| /_/    \\_\\__| |__|  |__|

Microsoft Windows XP [Version 5.1.2600]
(C) Copyright 1985-2001 Microsoft Corp.
`;

export function CommandPrompt({ windowId: _windowId }: CommandPromptProps) {
  const [cwd, setCwd] = useState('zaid-dir');
  const [scrollback, setScrollback] = useState<ScrollbackLine[]>([
    { id: 'banner', type: 'banner', text: ASCII_BANNER }
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [scrollback, input]);
  
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  const printLines = (lines: string | string[], type: 'output' | 'error' = 'output') => {
    const arr = Array.isArray(lines) ? lines : [lines];
    const newLines = arr.map(text => ({ id: generateId(), type, text }));
    setScrollback(prev => [...prev, ...newLines]);
  };
  
  const clearScreen = () => {
    setScrollback([]);
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const currentPath = getFsPath(cwd);
      
      // Echo input
      setScrollback(prev => [...prev, { id: generateId(), type: 'input', text: `${currentPath}>${input}` }]);
      
      if (cmd) {
        setHistory(prev => [...prev, cmd]);
        setHistoryIndex(-1);
        
        const ctx: CommandContext = {
          cwd,
          setCwd,
          fs: virtualFs,
          history,
          print: (lines) => printLines(lines, 'output'),
          clearScreen,
          launchApp: (appId, args) => useWindowStore.getState().launchApp(appId, args)
        };
        
        const result = parseAndExecute(cmd, ctx);
        if (result) {
          if (result.error) printLines(result.error, 'error');
          if (result.output) printLines(result.output, 'output');
        }
      }
      
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      // Ctrl+C behavior
      const currentPath = getFsPath(cwd);
      setScrollback(prev => [...prev, { id: generateId(), type: 'input', text: `${currentPath}>${input}^C` }]);
      setInput('');
      setHistoryIndex(-1);
    }
  };
  
  const currentPath = getFsPath(cwd);
  
  return (
    <div 
      className="flex flex-col w-full h-full bg-black text-gray-200 font-['Lucida_Console',_monospace] text-[14px] p-1 overflow-auto cursor-text select-text"
      onClick={() => inputRef.current?.focus()}
    >
      {scrollback.map(line => (
        <div 
          key={line.id} 
          className={`whitespace-pre-wrap leading-relaxed ${line.type === 'error' ? 'text-red-400' : ''}`}
        >
          {line.text}
        </div>
      ))}
      <div className="flex">
        <span className="whitespace-pre">{currentPath}&gt;</span>
        <input
          ref={inputRef}
          type="text"
          aria-label="Command input"
          className="flex-1 bg-transparent outline-none text-gray-200 ml-0 border-none p-0 focus:ring-0 focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
