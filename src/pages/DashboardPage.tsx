import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgentStore, useAuthStore } from '@/lib/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings2, Trash2, Cpu, Clock, Search, Sparkles, Activity, Globe, Wifi, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
export function DashboardPage() {
  const agents = useAgentStore((s) => s.agents) ?? [];
  const addAgent = useAgentStore((s) => s.addAgent);
  const deleteAgent = useAgentStore((s) => s.deleteAgent);
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const userName = user?.name || 'Architect';
  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );
  const handleCreateAgent = () => {
    const id = crypto.randomUUID();
    const unitTag = Math.floor(1000 + Math.random() * 9000);
    addAgent({
      id,
      name: `Vox-Unit-${unitTag}`,
      role: 'Intelligence Officer',
      systemPrompt: 'You are a Vox0-ki Intelligence Engine. Execute directives with extreme precision.',
      model: 'google-ai-studio/gemini-2.0-flash',
      tools: [],
      lastEdited: Date.now(),
    });
    toast.success(`Unit ${unitTag} initialized in the forge`);
    navigate(`/builder/${id}`);
  };
  const handleDelete = (id: string, name: string) => {
    deleteAgent(id);
    toast.info(`Vox-Unit "${name}" successfully decommissioned from ledger.`);
  };
  return (
    <AppLayout container className="bg-black">
      <div className="space-y-10 animate-fade-in max-w-7xl mx-auto px-1 sm:px-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/10 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-4 text-primary font-bold text-[10px] mb-2 uppercase tracking-[0.3em]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vox0-ki HQ</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-zinc-800" />
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Activity className="w-3 h-3 text-green-500" />
                <span>99.9% Uptime</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Welcome, <span className="text-gradient">{userName}</span></h1>
            <p className="text-zinc-400 text-sm md:text-base">Orchestrate your fleet of {agents.length} autonomous sovereign intelligences.</p>
          </div>
          <Button
            onClick={handleCreateAgent}
            className="btn-gradient px-8 py-7 rounded-2xl shadow-glow hover:-translate-y-1 transition-transform group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" /> New Vox-Unit
          </Button>
        </div>
        {/* Status Summary & Search */}
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1 w-full flex items-center gap-4 bg-zinc-900/30 p-1 rounded-2xl border border-white/5 backdrop-blur-xl group focus-within:border-primary/30 transition-colors">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Filter units by name or directive..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-600 h-12"
              />
            </div>
          </div>
          <div className="flex gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
             <div className="bg-zinc-950/50 border border-white/5 rounded-xl px-6 py-3 flex flex-col items-center justify-center min-w-[140px] shadow-sm">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Active Units</span>
                <span className="text-xl font-mono text-primary font-bold">{agents.length}</span>
             </div>
             <div className="bg-zinc-950/50 border border-white/5 rounded-xl px-6 py-3 flex flex-col items-center justify-center min-w-[140px] shadow-sm">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Edge Nodes</span>
                <span className="text-xl font-mono text-primary font-bold">310+</span>
             </div>
          </div>
        </div>
        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="group overflow-hidden border-primary/10 bg-zinc-950/40 backdrop-blur-md hover:border-primary/40 hover:shadow-glow transition-all duration-300 flex flex-col animate-scale-in">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge className="bg-black border border-primary/40 text-primary hover:bg-primary hover:text-black font-black tracking-widest text-[9px] px-2 py-0.5 animate-glow">
                      OPERATIONAL
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-2.5 h-2.5 text-green-500 animate-pulse" />
                      <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">14ms Latency</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="mt-6 text-xl text-white group-hover:text-primary transition-colors truncate">{agent.name}</CardTitle>
                <CardDescription className="text-zinc-500 font-medium truncate">{agent.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="flex items-center gap-6 text-[10px] text-zinc-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary/60" />
                    {new Date(agent.lastEdited).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-primary/60" />
                    {agent.tools.length} CAPABILITIES
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                   <Globe className="w-3 h-3 text-zinc-700" />
                   <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">Global Deploy Active</span>
                </div>
              </CardContent>
              <CardFooter className="bg-primary/5 border-t border-primary/10 flex justify-between gap-3 p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/builder/${agent.id}`)}
                  className="flex-1 border border-primary/20 hover:bg-primary hover:text-black font-bold rounded-xl transition-all h-10"
                >
                  Enter Builder
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(agent.id, agent.name)}
                  className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl w-10 h-10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {/* Empty State */}
        {agents.length === 0 && (
          <div className="text-center py-32 bg-zinc-950/40 rounded-[3rem] border border-dashed border-primary/20 flex flex-col items-center group">
            <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6 text-primary/20 group-hover:bg-primary/10 transition-colors">
              <LayoutGrid className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">The Forge is Silent</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mb-8">No sovereign units have been initialized in your workspace yet.</p>
            <Button onClick={handleCreateAgent} className="btn-gradient px-10 py-7 rounded-2xl font-bold">
              Initialize Your First Unit
            </Button>
          </div>
        )}
        {/* Search Empty State */}
        {agents.length > 0 && filteredAgents.length === 0 && (
          <div className="text-center py-24 bg-zinc-950/20 rounded-3xl border border-white/5">
             <Search className="w-12 h-12 mx-auto text-zinc-800 mb-4" />
             <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No units match your current directive</p>
             <Button variant="ghost" onClick={() => setSearch('')} className="mt-4 text-primary text-xs font-bold uppercase hover:bg-primary/5">Clear Global Filter</Button>
          </div>
        )}
      </div>
      <footer className="mt-24 py-12 border-t border-white/5 text-center space-y-2 opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Vox0-ki Platform v1.2.5 • Sovereign Build ID: f7e2a9b</p>
        <p className="text-[9px] text-zinc-700 italic">Global neural capacity is subject to regional model constraints. High-priority routing enabled for this architect.</p>
      </footer>
    </AppLayout>
  );
}