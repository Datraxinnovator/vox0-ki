import React from 'react';
import { AgentConfig, useAgentStore } from '@/lib/store';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, CloudSun, Database, Code, Globe } from 'lucide-react';
interface ToolDef {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}
const AVAILABLE_TOOLS: ToolDef[] = [
  { id: 'web_search', name: 'Web Search', description: 'Real-time browsing via SerpAPI', icon: <Search className="w-4 h-4" /> },
  { id: 'get_weather', name: 'Weather Service', description: 'Global forecasts and current conditions', icon: <CloudSun className="w-4 h-4" /> },
  { id: 'd1_db', name: 'D1 Database', description: 'Persistent SQL storage at the edge', icon: <Database className="w-4 h-4" /> },
  { id: 'mcp_server', name: 'MCP Integration', description: 'Connect external Model Context tools', icon: <Globe className="w-4 h-4" /> },
];
interface CapabilitiesPanelProps {
  agent: AgentConfig;
}
export function CapabilitiesPanel({ agent }: CapabilitiesPanelProps) {
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const toggleTool = (toolId: string) => {
    const currentTools = [...agent.tools];
    const index = currentTools.indexOf(toolId);
    if (index > -1) {
      currentTools.splice(index, 1);
    } else {
      currentTools.push(toolId);
    }
    updateAgent(agent.id, { tools: currentTools });
  };
  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Core Tools</h3>
        <div className="space-y-3">
          {AVAILABLE_TOOLS.map((tool) => (
            <div 
              key={tool.id} 
              className={`p-4 rounded-xl border transition-all ${
                agent.tools.includes(tool.id) 
                  ? 'bg-primary/5 border-primary/30 shadow-sm' 
                  : 'bg-card/50 border-white/5 opacity-70 grayscale-[0.5]'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    agent.tools.includes(tool.id) ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {tool.icon}
                  </div>
                  <div>
                    <Label htmlFor={tool.id} className="font-semibold cursor-pointer">{tool.name}</Label>
                    <p className="text-2xs text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                <Switch 
                  id={tool.id} 
                  checked={agent.tools.includes(tool.id)} 
                  onCheckedChange={() => toggleTool(tool.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Custom Integrations</h3>
        <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/2 text-center">
          <Code className="w-6 h-6 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">Advanced API integrations coming soon</p>
        </div>
      </div>
    </div>
  );
}