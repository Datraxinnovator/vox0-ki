import React, { useState, useEffect } from 'react';
import { AgentConfig } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Copy, Terminal, Database, Activity, Code } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
interface NeuralDevToolsProps {
  open: boolean;
  agent: AgentConfig;
  onClose: () => void;
}
export function NeuralDevTools({ open, agent, onClose }: NeuralDevToolsProps) {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    if (!open) return;
    // Simulated log initialization
    const initialLogs = [
      { id: 1, type: 'system', msg: `Neural Link established with unit ${agent.id.slice(0, 8)}`, time: Date.now() },
      { id: 2, type: 'protocol', msg: `Model handshake: ${agent.model}`, time: Date.now() + 100 },
      { id: 3, type: 'tool', msg: `${agent.tools.length} capabilities synchronized`, time: Date.now() + 200 },
    ];
    setLogs(initialLogs);
  }, [open, agent.id, agent.model, agent.tools.length]);
  const copyTrace = () => {
    navigator.clipboard.writeText(JSON.stringify(agent, null, 2));
    toast.success('Neural trace copied to clipboard.');
  };
  if (!open) return null;
  return (
    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-zinc-950 border-t border-primary/20 z-40 animate-slide-up flex flex-col">
      <header className="h-10 px-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/20">
        <div className="flex items-center gap-3">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural DevTools Console</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white" onClick={copyTrace}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>
      <Tabs defaultValue="protocol" className="flex-1 flex flex-col min-h-0">
        <TabsList className="h-9 bg-transparent border-b border-white/5 rounded-none px-2 flex justify-start gap-4">
          <TabsTrigger value="protocol" className="text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-3 rounded-md">
            Protocol Logs
          </TabsTrigger>
          <TabsTrigger value="state" className="text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-3 rounded-md">
            State Map
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-3 rounded-md">
            Tool Trace
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-hidden">
          <TabsContent value="protocol" className="m-0 h-full p-0">
            <ScrollArea className="h-full">
              <div className="p-4 font-mono text-[11px] space-y-2">
                {logs.map(log => (
                  <div key={log.id} className="flex gap-3">
                    <span className="text-zinc-600">[{new Date(log.time).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                    <span className={cn(
                      "font-bold uppercase",
                      log.type === 'system' ? "text-primary" : log.type === 'protocol' ? "text-blue-400" : "text-green-400"
                    )}>[{log.type}]</span>
                    <span className="text-zinc-300">{log.msg}</span>
                  </div>
                ))}
                <div className="text-zinc-600 animate-pulse mt-4">_ Neural stream awaiting directive...</div>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="state" className="m-0 h-full p-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <pre className="text-[11px] font-mono text-zinc-300 bg-black/40 p-4 rounded-xl border border-white/5">
                  <code className="text-primary">{"{"}</code>
                  {Object.entries(agent).map(([key, value]) => (
                    <div key={key} className="pl-4">
                      <span className="text-yellow-500">"{key}"</span>: <span className="text-zinc-400">{JSON.stringify(value)}</span>,
                    </div>
                  ))}
                  <code className="text-primary">{"}"}</code>
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="tools" className="m-0 h-full p-0">
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4 opacity-50">
              <Database className="h-10 w-10" />
              <p className="text-xs font-bold uppercase tracking-widest">No Tool Calls Recorded in Trace</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}