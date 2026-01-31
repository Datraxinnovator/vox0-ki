import React, { useEffect } from 'react';
import { AgentConfig, useAgentStore } from '@/lib/store';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, CloudSun, Database, Code, Globe, Zap, GripVertical, Plus } from 'lucide-react';
import { chatService } from '@/lib/chat';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
interface ToolDef {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}
const AVAILABLE_TOOLS: ToolDef[] = [
  { id: 'web_search', name: 'Web Oracle', description: 'Advanced real-time web intelligence', icon: <Search className="w-4 h-4" /> },
  { id: 'get_weather', name: 'Meteo Stream', description: 'Precise global climate analytics', icon: <CloudSun className="w-4 h-4" /> },
  { id: 'd1_db', name: 'D1 Matrix', description: 'Hyper-fast SQL storage at the edge', icon: <Database className="w-4 h-4" /> },
  { id: 'mcp_server', name: 'MCP Bridge', description: 'Seamless external protocol integration', icon: <Globe className="w-4 h-4" /> },
];
function SortableToolItem({ tool, isEnabled, onToggle }: { tool: ToolDef, isEnabled: boolean, onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tool.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-5 rounded-2xl border transition-all duration-300 ${
        isEnabled
          ? 'bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(255,215,0,0.1)]'
          : 'bg-zinc-950 border-primary/5 opacity-50'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-primary transition-colors">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            isEnabled ? 'bg-primary/20 text-primary border-primary/40' : 'bg-zinc-900 text-zinc-600 border-zinc-800'
          }`}>
            {tool.icon}
          </div>
          <div className="flex-1">
            <Label htmlFor={tool.id} className="font-bold text-white block truncate">{tool.name}</Label>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter font-bold">{tool.description}</p>
          </div>
        </div>
        <Switch
          id={tool.id}
          checked={isEnabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );
}
export function CapabilitiesPanel({ agent }: { agent: AgentConfig }) {
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  useEffect(() => {
    chatService.updateTools(agent.tools);
  }, [agent.tools]);
  const toggleTool = (toolId: string) => {
    const current = [...agent.tools];
    const index = current.indexOf(toolId);
    if (index > -1) current.splice(index, 1);
    else current.push(toolId);
    updateAgent(agent.id, { tools: current });
  };
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = agent.tools.indexOf(active.id as string);
      const newIndex = agent.tools.indexOf(over?.id as string);
      if (oldIndex !== -1 && newIndex !== -1) {
        updateAgent(agent.id, { tools: arrayMove(agent.tools, oldIndex, newIndex) });
      }
    }
  };
  // Re-sort AVAILABLE_TOOLS based on agent.tools order for visual consistency
  const sortedTools = [...AVAILABLE_TOOLS].sort((a, b) => {
    const idxA = agent.tools.indexOf(a.id);
    const idxB = agent.tools.indexOf(b.id);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
  return (
    <div className="p-8 space-y-10">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
          <Zap className="w-3 h-3" /> Priority Stack
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedTools.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {sortedTools.map((tool) => (
                <SortableToolItem
                  key={tool.id}
                  tool={tool}
                  isEnabled={agent.tools.includes(tool.id)}
                  onToggle={() => toggleTool(tool.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div className="pt-6 border-t border-primary/10">
        <div className="flex items-center gap-2 text-zinc-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
          <Code className="w-3 h-3" /> Custom Protocols
        </div>
        <div className="p-8 rounded-3xl border border-dashed border-primary/10 bg-zinc-950/40 text-center group cursor-not-allowed">
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4 text-zinc-700">
            <Plus className="w-6 h-6" />
          </div>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Enterprise API Connector</p>
        </div>
      </div>
    </div>
  );
}