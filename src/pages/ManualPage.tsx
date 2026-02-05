import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Code, Zap, Globe, Shield, Terminal, Copy, Server, Database, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
export function ManualPage() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard.`);
  };
  return (
    <AppLayout container className="bg-black">
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest mx-auto">
            <Shield className="w-3 h-3" /> Production Sovereignty
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Tech <span className="text-gradient">Manual</span></h1>
          <p className="text-zinc-500 max-w-xl mx-auto">Master the architecting and global deployment of high-performance sovereign intelligence.</p>
        </header>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-900/50 border border-white/5 rounded-xl h-12 p-1">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs uppercase tracking-widest transition-all">Overview</TabsTrigger>
            <TabsTrigger value="deployment" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs uppercase tracking-widest transition-all">Deployment Protocol</TabsTrigger>
            <TabsTrigger value="troubleshooting" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs uppercase tracking-widest transition-all">Troubleshooting</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-8 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DocTopic icon={<Zap className="text-primary" />} title="Getting Started" desc="Initialize your first Vox-Unit in under 60 seconds using the Forge dashboard." />
              <DocTopic icon={<Code className="text-primary" />} title="Prompt Engineering" desc="Learn advanced directive syntax for ultra-high-fidelity model responses." />
              <DocTopic icon={<Globe className="text-primary" />} title="Edge Deployment" desc="Deploying intelligence nodes globally with sub-50ms latency windows." />
              <DocTopic icon={<Shield className="text-primary" />} title="Safety Protocols" desc="Implementing strict data boundaries and sovereign intelligence guardrails." />
            </div>
          </TabsContent>
          <TabsContent value="deployment" className="space-y-8 pt-8">
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" /> 1. Cloudflare Configuration
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Vox0-ki requires specific Durable Object (DO) namespaces to maintain persistence across the global edge. Ensure the following bindings are created in your Cloudflare Dashboard:
                </p>
                <ul className="space-y-3 pl-4 border-l border-primary/20">
                  <li className="text-xs text-zinc-300">
                    <strong className="text-primary">CHAT_AGENT:</strong> Bind to class <code className="text-white bg-zinc-900 px-1 rounded">ChatAgent</code>. <span className="text-zinc-500 italic">(Requires SQLite enabled)</span>
                  </li>
                  <li className="text-xs text-zinc-300">
                    <strong className="text-primary">APP_CONTROLLER:</strong> Bind to class <code className="text-white bg-zinc-900 px-1 rounded">AppController</code>.
                  </li>
                </ul>
              </section>
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" /> 2. Environment Variables
                </h3>
                <div className="bg-zinc-950 border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase">
                    <span>Required Variables</span>
                    <Button variant="ghost" size="sm" className="h-6 text-[9px]" onClick={() => copyToClipboard('CF_AI_BASE_URL=""\nCF_AI_API_KEY=""', 'Variables')}>
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                  </div>
                  <pre className="text-xs text-primary font-mono bg-black/40 p-3 rounded-lg overflow-x-auto">
                    CF_AI_BASE_URL=https://gateway.ai.cloudflare.com/v1/ID/openai<br />
                    CF_AI_API_KEY=your_secure_api_key
                  </pre>
                </div>
              </section>
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" /> 3. Migration & Deployment
                </h3>
                <p className="text-sm text-zinc-400">Execute these commands to synchronize your local forge with the production edge:</p>
                <div className="grid grid-cols-1 gap-4">
                  <CommandLine label="Generate Types" cmd="bun run cf-typegen" />
                  <CommandLine label="Deploy to Edge" cmd="bun run deploy" />
                </div>
              </section>
            </div>
          </TabsContent>
          <TabsContent value="troubleshooting" className="space-y-6 pt-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-primary/10 bg-zinc-950/40 rounded-2xl px-6">
                <AccordionTrigger className="text-white hover:text-primary hover:no-underline">Durable Object Binding Failure</AccordionTrigger>
                <AccordionContent className="text-zinc-400 leading-relaxed pt-2">
                  If the worker fails to start, verify your <code className="text-primary font-mono text-xs">wrangler.jsonc</code> contains the correct class names. Ensure the <code className="text-white">migrations</code> tag matches the namespace you are attempting to initialize.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-primary/10 bg-zinc-950/40 rounded-2xl px-6">
                <AccordionTrigger className="text-white hover:text-primary hover:no-underline">Missing SQLite Capability</AccordionTrigger>
                <AccordionContent className="text-zinc-400 leading-relaxed pt-2">
                  The <code className="text-primary font-mono text-xs">CHAT_AGENT</code> requires DO-SQLite. If you see storage errors, ensure your Cloudflare account has the beta/production DO-SQLite flag active for the specific namespace.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-primary/10 bg-zinc-950/40 rounded-2xl px-6">
                <AccordionTrigger className="text-white hover:text-primary hover:no-underline">Gateway Latency Issues</AccordionTrigger>
                <AccordionContent className="text-zinc-400 leading-relaxed pt-2">
                  Check your <code className="text-primary font-mono text-xs">CF_AI_BASE_URL</code>. High latency often occurs when using a Gateway region distant from your primary traffic sources.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h4 className="text-white font-bold text-sm">Critical Warning</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Never commit your <code className="text-red-400">CF_AI_API_KEY</code> to public repositories. Use Cloudflare Secrets or encrypted environment variables for all production deployments.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
           <Button variant="outline" onClick={() => copyToClipboard('bun add -g @vox0-ki/cli', 'CLI Command')} className="border-primary/20 text-primary rounded-xl h-11">
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
function CommandLine({ label, cmd }: { label: string, cmd: string }) {
  const copy = () => {
    navigator.clipboard.writeText(cmd);
    toast.success(`${label} copied.`);
  };
  return (
    <div className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl group hover:border-primary/30 transition-colors">
      <div className="space-y-1">
        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
        <code className="text-xs text-zinc-300 font-mono">{cmd}</code>
      </div>
      <Button variant="ghost" size="icon" onClick={copy} className="text-zinc-600 hover:text-primary transition-colors">
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
}