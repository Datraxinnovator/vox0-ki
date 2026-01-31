import React from 'react';
import { AgentConfig, useAgentStore } from '@/lib/store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MODELS } from '@/lib/chat';
interface ConfigPanelProps {
  agent: AgentConfig;
}
export function ConfigPanel({ agent }: ConfigPanelProps) {
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const handleChange = (field: keyof AgentConfig, value: any) => {
    updateAgent(agent.id, { [field]: value });
  };
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
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Core Role</Label>
            <Input 
              id="role" 
              placeholder="e.g. Code Reviewer" 
              value={agent.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="bg-secondary/50"
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
              onValueChange={(v) => handleChange('model', v)}
            >
              <SelectTrigger className="bg-secondary/50">
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
              className="min-h-[200px] bg-secondary/50 leading-relaxed resize-none"
              value={agent.systemPrompt}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Describe your agent's personality and rules.</p>
          </div>
        </div>
      </div>
    </div>
  );
}