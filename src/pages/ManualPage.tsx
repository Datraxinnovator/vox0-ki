import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, Zap, Globe, Shield, Terminal } from 'lucide-react';
export function ManualPage() {
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
          <DocTopic icon={<Zap className="text-primary" />} title="Getting Started" desc="Initialize your first Vox-Unit in under 60 seconds." />
          <DocTopic icon={<Code className="text-primary" />} title="Prompt Engineering" desc="Advanced directive syntax for premium model behavior." />
          <DocTopic icon={<Globe className="text-primary" />} title="Edge Deployment" desc="Scaling your agents across Cloudflare's global network." />
          <DocTopic icon={<Shield className="text-primary" />} title="Safety Protocols" desc="Implementing sovereign data boundaries and guardrails." />
        </div>
        <div className="pt-12">
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-primary/10 pb-4">Architecting FAQ</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border-primary/10 bg-zinc-950/40 rounded-2xl px-6">
              <AccordionTrigger className="text-white hover:text-primary transition-colors hover:no-underline">How do I integrate custom D1 databases?</AccordionTrigger>
              <AccordionContent className="text-zinc-400 leading-relaxed pt-2">
                Simply enable the <code className="text-primary font-mono text-xs">D1 Matrix</code> tool in the Capabilities Panel. Ensure your <code className="text-primary font-mono text-xs">WRANGLER_D1_ID</code> is correctly injected in the Security Vault.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-primary/10 bg-zinc-950/40 rounded-2xl px-6">
              <AccordionTrigger className="text-white hover:text-primary transition-colors hover:no-underline">What is the Vox0-ki Neural Stream?</AccordionTrigger>
              <AccordionContent className="text-zinc-400 leading-relaxed pt-2">
                The Neural Stream is our proprietary high-speed WebSocket-mimicking protocol that streams model tokens to the UI with sub-50ms latency.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-primary/10 bg-zinc-950/40 rounded-2xl px-6">
              <AccordionTrigger className="text-white hover:text-primary transition-colors hover:no-underline">Can I export my agent's personality?</AccordionTrigger>
              <AccordionContent className="text-zinc-400 leading-relaxed pt-2">
                Yes, every agent can be exported as a <code className="text-primary font-mono text-xs">.blueprint.json</code> file, containing the full system prompt, tool mappings, and model configuration.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-primary/10 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <Terminal className="w-8 h-8 text-primary" />
             <div>
               <h4 className="font-bold text-white uppercase tracking-tighter">CLI Tooling Available</h4>
               <p className="text-xs text-zinc-500 font-mono italic">bun add -g @vox0-ki/cli</p>
             </div>
           </div>
           <Button variant="outline" className="border-primary/20 text-primary rounded-xl">Get CLI</Button>
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