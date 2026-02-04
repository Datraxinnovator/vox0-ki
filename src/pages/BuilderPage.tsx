import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAgentStore } from '@/lib/store';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { ConfigPanel } from '@/components/builder/ConfigPanel';
import { CapabilitiesPanel } from '@/components/builder/CapabilitiesPanel';
import { LiveEmulator } from '@/components/builder/LiveEmulator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
export function BuilderPage() {
  const { id } = useParams<{id: string}>();
  const agent = useAgentStore((s) => id ? s.getAgent(id) : null);
  const isMobile = useIsMobile();

  if (!id || !agent) return <Navigate to='/dashboard' replace />;

  return (
    <BuilderLayout agent={agent}>
      {isMobile ? (
        <Tabs defaultValue="config" className="w-full flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-900/50 rounded-none border-b border-white/5">
            <TabsTrigger value="config" className="text-xs uppercase font-bold tracking-widest">Config</TabsTrigger>
            <TabsTrigger value="tools" className="text-xs uppercase font-bold tracking-widest">Tools</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs uppercase font-bold tracking-widest">Preview</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto bg-black">
            <TabsContent value="config" className="p-0 m-0">
              <ConfigPanel agent={agent} />
            </TabsContent>
            <TabsContent value="tools" className="p-0 m-0">
              <CapabilitiesPanel agent={agent} />
            </TabsContent>
            <TabsContent value="preview" className="p-0 m-0 h-full">
              <LiveEmulator agent={agent} />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="h-full bg-black">
          <ResizablePanel defaultSize={20} minSize={15} className="bg-zinc-950/30">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <ConfigPanel agent={agent} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-primary/10 hover:bg-primary/30 transition-colors w-[1px]" />
          <ResizablePanel defaultSize={25} minSize={20} className="bg-zinc-900/10">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <CapabilitiesPanel agent={agent} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-primary/10 hover:bg-primary/30 transition-colors w-[1px]" />
          <ResizablePanel defaultSize={55} minSize={30}>
            <LiveEmulator agent={agent} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </BuilderLayout>
  );
}