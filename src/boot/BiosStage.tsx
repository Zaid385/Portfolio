import { useEffect, useState } from 'react';

export function BiosStage({ onComplete }: { onComplete: () => void }) {
  const [messages, setMessages] = useState<string[]>([]);
  
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
      "Press DEL to enter SETUP",
      "Booting from hard disk..."
    ];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intervalMs = prefersReducedMotion ? 20 : 150;

    let current = 0;
    const interval = setInterval(() => {
      setMessages((prev) => [...prev, sequence[current]]);
      current++;
      if (current >= sequence.length) {
        clearInterval(interval);
        setTimeout(onComplete, prefersReducedMotion ? 50 : 500);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-black text-gray-300 font-mono text-sm sm:text-base p-4 overflow-hidden">
      {messages.map((msg, i) => (
        <div key={i} className="min-h-[1.2em]">{msg}</div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  );
}
