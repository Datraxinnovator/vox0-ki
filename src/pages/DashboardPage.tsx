import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgentStore, useAuthStore } from '@/lib/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings2, Trash2, Cpu, Clock, Search, Sparkles, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
export function DashboardPage() {
  const agents = useAgentStore((s) => s.agents);
  const addAgent = useAgentStore((s) => s.addAgent);
  const deleteAgent = useAgentStore((s) => s.deleteAgent);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const userName = user?.name || 'Builder';
  const handleCreateAgent = () => {
    const id = crypto.randomUUID();
    addAgent({
      id,
      name: 'New Vox-Unit',
      role: 'Intelligence Officer',
      systemPrompt: 'You are a Vox0-ki Intelligence Engine.',
      model: 'google-ai-studio/gemini-2.5-flash',
      tools: [],
      lastEdited: Date.now(),
    });
    toast.success('Vox-Unit initialized in the forge');
    navigate(`/builder/${id}`);
  };
  return (
    <AppLayout container className="bg-black">
      <div className="space-y-10 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/10 pb-8">
          <div>
            <div className="flex items-center gap-4 text-primary font-bold text-sm mb-2 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Vox0-ki HQ</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-zinc-800" />
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Activity className="w-3 h-3 text-green-500" />
                <span className="text-[10px]">99.9% Uptime</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Welcome, <span className="text-gradient">{userName}</span></h1>
            <p className="text-zinc-400 mt-1">Orchestrate your fleet of autonomous sovereign intelligences.</p>
          </div>
          <Button onClick={handleCreateAgent} className="btn-gradient px-8 py-7 rounded-2xl shadow-glow">
            <Plus className="w-5 h-5 mr-2" /> New Vox-Unit
          </Button>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/50 p-1.5 rounded-2xl border border-primary/10 backdrop-blur-xl max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
            <Input
              placeholder="Filter by unit name or role..."
              className="pl-12 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-600"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <Card key={agent.id} className="group overflow-hidden border-primary/10 bg-zinc-950/40 backdrop-blur-md hover:border-primary/40 hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge className="bg-black border border-primary/40 text-primary hover:bg-primary hover:text-black font-black tracking-widest text-[9px] px-2 py-0.5">
                      OPERATIONAL
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] text-zinc-600 font-bold uppercase">Ready</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="mt-6 text-xl text-white group-hover:text-primary transition-colors">{agent.name}</CardTitle>
                <CardDescription className="text-zinc-500 font-medium">{agent.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
              <CardFooter className="bg-primary/5 border-t border-primary/10 flex justify-between gap-3 p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/builder/${agent.id}`)}
                  className="flex-1 border border-primary/20 hover:bg-primary hover:text-black font-bold rounded-xl transition-all"
                >
                  Enter Builder
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    deleteAgent(agent.id);
                    toast.info('Unit decommissioned');
                  }}
                  className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {agents.length === 0 && (
          <div className="text-center py-32 bg-zinc-950/40 rounded-[3rem] border border-dashed border-primary/20 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 text-primary/30">
              <Cpu className="w-10 h-10" />
            </div>
            <p className="text-zinc-500 text-lg font-medium">Your forge is currently silent.</p>
            <Button variant="link" onClick={handleCreateAgent} className="text-primary mt-2">Initialize your first unit →</Button>
          </div>
        )}
      </div>
      <footer className="mt-20 pt-12 border-t border-white/5 text-center space-y-2">
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Vox0-ki Platform v1.2.0 �� Build ID: f7e2a9b</p>
        <p className="text-[9px] text-zinc-700 italic">AI capacity is subject to global model constraints. High-priority routing is enabled for this session.</p>
      </footer>
    </AppLayout>
  );
}