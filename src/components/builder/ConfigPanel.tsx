import React, { useEffect, useRef } from 'react';
import { AgentConfig, useAgentStore } from '@/lib/store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MODELS, chatService } from '@/lib/chat';
interface ConfigPanelProps {
  agent: AgentConfig;
}
export function ConfigPanel({ agent }: ConfigPanelProps) {
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleChange = (field: keyof AgentConfig, value: any) => {
    updateAgent(agent.id, { [field]: value });
  };
  // Sync model selection immediately
  const handleModelChange = (value: string) => {
    handleChange('model', value);
    chatService.updateModel(value);
  };
  // Debounced sync for system prompt to backend
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      chatService.updateSystemPrompt(agent.systemPrompt);
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [agent.systemPrompt]);
  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Identity</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={agent.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-secondary/50 border-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Core Role</Label>
            <Input
              id="role"
              placeholder="e.g. Code Reviewer"
              value={agent.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="bg-secondary/50 border-white/5"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Behavior</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">Language Model</Label>
            <Select
              value={agent.model}
              onValueChange={handleModelChange}
            >
              <SelectTrigger className="bg-secondary/50 border-white/5">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">System Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Instructions for the agent..."
              className="min-h-[250px] bg-secondary/50 leading-relaxed resize-none border-white/5"
              value={agent.systemPrompt}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
            />
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">Syncs automatically to live preview.</p>
          </div>
        </div>
      </div>
    </div>
  );
}