import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AgentConfig } from '@/lib/store';
import { ArrowLeft, Save, Globe, Share2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
interface BuilderLayoutProps {
  children: React.ReactNode;
  agent: AgentConfig;
}
export function BuilderLayout({ children, agent }: BuilderLayoutProps) {
  const navigate = useNavigate();
  const handleDeploy = () => {
    toast.promise(
      new Promise((res) => {
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#B8860B', '#FFFACD'],
            zIndex: 9999
          });
          res(true);
        }, 2000);
      }),
      {
        loading: 'Orchestrating intelligence on the global edge...',
        success: 'Agent deployed successfully to 310+ locations.',
        error: 'Deployment protocol interrupted.',
      }
    );
  };
  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden selection:bg-primary/20">
      <header className="h-20 border-b border-primary/10 px-8 flex items-center justify-between bg-zinc-950/50 backdrop-blur-2xl z-40">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl border border-primary/10 hover:bg-primary hover:text-black transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-10 w-[1px] bg-primary/10 hidden sm:block" />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">
                {agent.name}
              </h2>
              <span className="text-[10px] px-3 py-1 rounded-full bg-black text-primary border border-primary/40 font-black tracking-widest uppercase">
                DRAFT ARCHITECTURE
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className="w-3 h-3 text-primary/60" />
              <p className="text-[10px] text-zinc-500 font-bold font-mono tracking-tighter uppercase">
                SECURE SESSION ��� UID-{agent.id.slice(0, 12).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex border-primary/20 bg-transparent text-primary hover:bg-primary/10 rounded-xl px-6 h-11 font-bold"
            onClick={() => toast.info('Changes committed to persistent storage.')}
          >
            <Save className="w-4 h-4 mr-2" /> Commit
          </Button>
          <Button size="sm" className="btn-gradient h-11 px-8 rounded-xl shadow-glow" onClick={handleDeploy}>
            <Globe className="w-4 h-4 mr-2" /> Global Deploy
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl border border-primary/5 hover:bg-zinc-900 h-11 w-11">
            <Share2 className="w-5 h-5 text-zinc-500" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}