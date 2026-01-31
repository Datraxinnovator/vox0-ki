import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAgentStore } from '@/lib/store';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { ConfigPanel } from '@/components/builder/ConfigPanel';
import { CapabilitiesPanel } from '@/components/builder/CapabilitiesPanel';
import { ChatPreview } from '@/components/builder/ChatPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
export function BuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getAgent = useAgentStore((s) => s.getAgent);
  const isMobile = useIsMobile();
  const agent = id ? getAgent(id) : null;
  useEffect(() => {
    if (!agent && id) {
      navigate('/dashboard');
    }
  }, [agent, id, navigate]);
  if (!agent) return null;
  return (
    <BuilderLayout agent={agent}>
      {isMobile ? (
        <Tabs defaultValue="config" className="w-full flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50 rounded-none border-b border-white/5">
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="config" className="p-4 m-0">
              <ConfigPanel agent={agent} />
            </TabsContent>
            <TabsContent value="tools" className="p-4 m-0">
              <CapabilitiesPanel agent={agent} />
            </TabsContent>
            <TabsContent value="preview" className="p-0 m-0 h-full">
              <ChatPreview agent={agent} />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <div className="flex h-full overflow-hidden">
          {/* Config Column */}
          <div className="w-80 border-r border-white/10 bg-card/30 flex flex-col overflow-y-auto">
            <ConfigPanel agent={agent} />
          </div>
          {/* Capabilities Column */}
          <div className="w-96 border-r border-white/10 bg-secondary/20 flex flex-col overflow-y-auto">
            <CapabilitiesPanel agent={agent} />
          </div>
          {/* Preview Column */}
          <div className="flex-1 bg-background flex flex-col">
            <ChatPreview agent={agent} />
          </div>
        </div>
      )}
    </BuilderLayout>
  );
}