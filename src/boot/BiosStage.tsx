import { useEffect, useRef, useState } from 'react';

export function BiosStage({ onComplete }: { onComplete: () => void }) {
  const [messages, setMessages] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const sequence = [
      "Award Modular BIOS v6.00PG, An Energy Star Ally",
      "Copyright (C) 1984-2001, Award Software, Inc.",
      "",
      "Main Processor : Intel(R) Pentium(R) 4 1.50GHz",
      "Memory Testing :  131072K OK",
      "",
      "Primary Master : ST340016A",
      "Primary Slave  : None",
      "Secondary Master : ATAPI CD-ROM",
      "Secondary Slave  : None",
      "",
      "Detecting IDE Drives.................... OK",
      "Initializing USB Controller............. OK",
      "Initializing Keyboard................... OK",
      "Initializing Mouse...................... OK",
      "",
      "Detecting User.......................... ZAID",
      "Checking Sleep Schedule.................. FAILED",
      "Checking Caffeine Levels................. OPTIMAL",
      "Checking Unfinished Projects............. FOUND",
      "Checking Common Sense.................... NOT FOUND",
      "",
      "System Status........................... QUESTIONABLE",
      "Developer Mode.......................... ENABLED",
      "",
      "Press DEL to enter SETUP",
      "Booting from hard disk..."
    ];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intervalMs = prefersReducedMotion ? 10 : 60;

    let current = 0;
    const interval = setInterval(() => {
      setMessages((prev) => [...prev, sequence[current]]);
      current++;
      if (current >= sequence.length) {
        clearInterval(interval);
        setTimeout(onComplete, prefersReducedMotion ? 50 : 400);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messages]);

  return (
    <div className="w-full h-full bg-black text-gray-300 font-mono text-sm sm:text-base p-4 overflow-y-auto">
      {messages.map((msg, i) => (
        <div key={i} className="min-h-[1.2em]">{msg}</div>
      ))}
      <div ref={bottomRef} className="animate-pulse">_</div>
    </div>
  );
}
