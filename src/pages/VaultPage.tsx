import React, { useState } from 'react';
import { useVaultStore } from '@/lib/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, Key, Eye, EyeOff, Trash2, Plus, Lock, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
export function VaultPage() {
  const secrets = useVaultStore((s) => s.secrets);
  const addSecret = useVaultStore((s) => s.addSecret);
  const deleteSecret = useVaultStore((s) => s.deleteSecret);
  const [newSecretName, setNewSecretName] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleReveal = (id: string) => {
    const next = new Set(revealedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedIds(next);
  };
  const handleAdd = () => {
    if (!newSecretName || !newSecretValue) return;
    addSecret({ name: newSecretName, value: newSecretValue });
    setNewSecretName('');
    setNewSecretValue('');
    setIsDialogOpen(false);
    toast.success('Protocol secret injected into high-security storage.');
  };
  return (
    <AppLayout container className="bg-black">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
              <Shield className="w-3 h-3" /> Sovereign Security
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Security <span className="text-gradient">Vault</span></h1>
            <p className="text-zinc-500 max-w-2xl">Manage your encrypted environment variables and access protocols across the network.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient px-8 py-7 rounded-2xl shadow-glow">
                <Plus className="w-5 h-5 mr-2" /> Inject Secret
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-primary/20 text-white rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">New Security Protocol</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Secret Name</label>
                  <Input value={newSecretName} onChange={(e) => setNewSecretName(e.target.value)} placeholder="e.g. OPENAI_API_KEY" className="bg-black border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Secret Value</label>
                  <Input type="password" value={newSecretValue} onChange={(e) => setNewSecretValue(e.target.value)} placeholder="••••••••••••" className="bg-black border-white/10" />
                </div>
                <Button onClick={handleAdd} className="w-full btn-gradient py-6 rounded-xl mt-4">Confirm Injection</Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>
        <div className="grid gap-6">
          {secrets.map((s) => (
            <Card key={s.id} className="border-primary/10 bg-zinc-950/40 backdrop-blur-md hover:border-primary/20 transition-all">
              <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-primary border border-white/5">
                  <Key className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-lg">{s.name}</h3>
                    <Badge variant="outline" className="text-[9px] border-primary/10 text-zinc-500">AES_256_ENCRYPTED</Badge>
                  </div>
                  <div className="font-mono text-zinc-600 text-sm tracking-widest">
                    {revealedIds.has(s.id) ? s.value : '••••••••••••••••'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => toggleReveal(s.id)} className="hover:bg-zinc-900">
                    {revealedIds.has(s.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { deleteSecret(s.id); toast.info('Secret purged from ledger.'); }} className="hover:bg-red-500/10 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {secrets.length === 0 && (
            <div className="py-20 text-center border border-dashed border-primary/20 rounded-3xl bg-zinc-950/20">
              <Lock className="w-12 h-12 mx-auto text-zinc-800 mb-4" />
              <p className="text-zinc-500">No active security protocols in the vault.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}