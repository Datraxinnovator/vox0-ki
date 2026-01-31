import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AgentConfig } from '@/lib/store';
import { ArrowLeft, Save, Globe, Share2 } from 'lucide-react';
import { toast } from 'sonner';
interface BuilderLayoutProps {
  children: React.ReactNode;
  agent: AgentConfig;
}
export function BuilderLayout({ children, agent }: BuilderLayoutProps) {
  const navigate = useNavigate();
  const handleDeploy = () => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Deploying agent to Cloudflare Edge...',
      success: 'Agent deployed successfully!',
      error: 'Deployment failed',
    });
  };
  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Builder Header */}
      <header className="h-16 border-b border-white/10 px-4 flex items-center justify-between bg-card/50 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              {agent.name}
              <span className="text-2xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Draft</span>
            </h2>
            <p className="text-xs text-muted-foreground">ID: {agent.id.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => toast.info('Saved locally')}>
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
          <Button size="sm" className="btn-gradient" onClick={handleDeploy}>
            <Globe className="w-4 h-4 mr-2" /> Deploy
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}