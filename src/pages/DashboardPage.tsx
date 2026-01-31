import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgentStore, useAuthStore } from '@/lib/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings2, Trash2, Cpu, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
export function DashboardPage() {
  const agents = useAgentStore((s) => s.agents);
  const addAgent = useAgentStore((s) => s.addAgent);
  const deleteAgent = useAgentStore((s) => s.deleteAgent);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const handleCreateAgent = () => {
    const id = crypto.randomUUID();
    addAgent({
      id,
      name: 'New Agent',
      role: 'Assistant',
      systemPrompt: 'You are a helpful assistant.',
      model: 'google-ai-studio/gemini-2.5-flash',
      tools: [],
      lastEdited: Date.now(),
    });
    toast.success('Agent created');
    navigate(`/builder/${id}`);
  };
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || 'Builder'}</h1>
            <p className="text-muted-foreground">Manage and monitor your autonomous AI agents.</p>
          </div>
          <Button onClick={handleCreateAgent} className="btn-gradient px-6 py-6 rounded-xl font-semibold">
            <Plus className="w-5 h-5 mr-2" /> Create New Agent
          </Button>
        </div>
        <div className="flex items-center gap-4 bg-secondary/30 p-2 rounded-xl border border-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search agents..." 
              className="pl-10 bg-transparent border-none focus-visible:ring-0" 
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="group overflow-hidden border-white/10 bg-card/40 backdrop-blur-sm hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                    Active
                  </Badge>
                </div>
                <CardTitle className="mt-4">{agent.name}</CardTitle>
                <CardDescription className="line-clamp-1">{agent.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(agent.lastEdited).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings2 className="w-4 h-4" />
                    {agent.tools.length} Tools
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/20 border-t border-white/5 flex justify-between gap-2 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/builder/${agent.id}`)} className="flex-1">
                  Edit Agent
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    deleteAgent(agent.id);
                    toast.info('Agent deleted');
                  }} 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {agents.length === 0 && (
          <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-white/10">
            <p className="text-muted-foreground">No agents found. Start by creating your first AI worker!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}