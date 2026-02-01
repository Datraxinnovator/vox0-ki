import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Cpu, Gauge, Palette, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
export function TuningPage() {
  const handleSave = () => {
    toast.success('System parameters optimized.');
  };
  return (
    <AppLayout container className="bg-black">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
              <Settings className="w-3 h-3" /> Core Engine
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">System <span className="text-gradient">Tuning</span></h1>
            <p className="text-zinc-500 max-w-2xl">Calibrate global intelligence behaviors and platform visual ergonomics.</p>
          </div>
          <Button onClick={handleSave} className="btn-gradient px-8 py-7 rounded-2xl shadow-glow">
            <Zap className="w-5 h-5 mr-2" /> Apply Protocols
          </Button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-primary/10 bg-zinc-950/40 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center gap-3 text-primary mb-2">
                <Cpu className="w-5 h-5" />
                <CardTitle>Inference Parameters</CardTitle>
              </div>
              <CardDescription>Configure global defaults for agent intelligence.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Default Intelligence Engine</Label>
                  <Select defaultValue="gemini-pro">
                    <SelectTrigger className="w-[200px] bg-black border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-pro">Gemini 2.5 Pro</SelectItem>
                      <SelectItem value="gpt-4o">OpenAI GPT-4o</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Creativity Bias (Temperature)</Label>
                    <span className="text-xs font-mono text-primary">0.7</span>
                  </div>
                  <Slider defaultValue={[70]} max={100} step={1} className="[&_[role=slider]]:bg-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-zinc-950/40 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center gap-3 text-primary mb-2">
                <Palette className="w-5 h-5" />
                <CardTitle>Interface Protocols</CardTitle>
              </div>
              <CardDescription>Fine-tune the workspace visual fidelity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Neural Stream Animation</Label>
                    <p className="text-xs text-zinc-500">Enable high-performance chat transitions.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Luxury Glow Effects</Label>
                    <p className="text-xs text-zinc-500">Toggle premium interface depth shadows.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-zinc-950/40 backdrop-blur-md lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3 text-primary mb-2">
                <ShieldCheck className="w-5 h-5" />
                <CardTitle>Safety & Sovereignty</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
               <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black">
                     <Gauge className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-bold text-white text-lg uppercase tracking-tight">Production Readiness Index</h4>
                     <p className="text-zinc-500 text-sm">Your forge is currently operating at 100% efficiency.</p>
                   </div>
                 </div>
                 <Badge className="bg-primary text-black font-black px-6 py-2 rounded-full">CERTIFIED SOVEREIGN</Badge>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}