import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, Zap, Globe, Shield, Terminal, Copy } from 'lucide-react';
import { toast } from 'sonner';
export function ManualPage() {
  const copyCommand = () => {
    navigator.clipboard.writeText('bun add -g @vox0-ki/cli');
    toast.success('CLI installation protocol copied to clipboard.');
  };
  return (
    <AppLayout container className="bg-black">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest mx-auto">
            <BookOpen className="w-3 h-3" /> Core Protocols
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Tech <span className="text-gradient">Manual</span></h1>
          <p className="text-zinc-500 max-w-xl mx-auto">Master the architecting of high-performance sovereign intelligence with our official documentation.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocTopic icon={<Zap className="text-primary" />} title="Getting Started" desc="Initialize your first Vox-Unit in under 60 seconds using the Forge dashboard." />
          <DocTopic icon={<Code className="text-primary" />} title="Prompt Engineering" desc="Learn the advanced directive syntax for ultra-high-fidelity model responses." />
          <DocTopic icon={<Globe className="text-primary" />} title="Edge Deployment" desc="Deploying intelligence nodes globally with sub-50ms latency windows." />
          <DocTopic icon={<Shield className="text-primary" />} title="Safety Protocols" desc="Implementing strict data boundaries and sovereign intelligence guardrails." />
        </div>
        <div className="pt-12">
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-primary/10 pb-4">Architecting FAQ</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border-primary/10 bg-zinc-950/40 rounded-2xl px-6">
              <AccordionTrigger className="text-white hover:text-primary hover:no-underline">How do I integrate custom D1 databases?</AccordionTrigger>
              <AccordionContent className="text-zinc-400 leading-relaxed pt-2">
                Enable the <code className="text-primary font-mono text-xs">D1 Matrix</code> tool in the Capabilities Panel. Your database bindings must be configured in your Cloudflare environment to synchronize correctly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-primary/10 bg-zinc-950/40 rounded-2xl px-6">
              <AccordionTrigger className="text-white hover:text-primary hover:no-underline">What is the Neural Stream?</AccordionTrigger>
              <AccordionContent className="text-zinc-400 leading-relaxed pt-2">
                The Neural Stream is our high-speed token delivery system. It ensures that model inferences are streamed to your workspace without buffering.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-primary/10 bg-zinc-950/40 rounded-2xl px-6">
              <AccordionTrigger className="text-white hover:text-primary hover:no-underline">Can I export blueprints?</AccordionTrigger>
              <AccordionContent className="text-zinc-400 leading-relaxed pt-2">
                Blueprints can be exported from the Builder header. This captures the system prompt, tool prioritize list, and model settings as a single deployment package.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
               <Terminal className="w-6 h-6" />
             </div>
             <div>
               <h4 className="font-bold text-white uppercase tracking-tighter">CLI Tooling Available</h4>
               <p className="text-xs text-zinc-500 font-mono italic">bun add -g @vox0-ki/cli</p>
             </div>
           </div>
           <Button variant="outline" onClick={copyCommand} className="border-primary/20 text-primary rounded-xl h-11">
             <Copy className="w-4 h-4 mr-2" /> Copy Install
           </Button>
        </div>
      </div>
    </AppLayout>
  );
}
function DocTopic({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 hover:border-primary/20 transition-all group cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  )
}