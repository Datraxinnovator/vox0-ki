import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Cpu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function HomePage() {
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary/20 selection:text-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="relative z-10 text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-bold text-primary mb-4 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>THE GOLD STANDARD OF AI</span>
            </div>
            <h1 className="text-display font-bold tracking-tight">
              Architect Elite <span className="text-gradient">Vox0-ki</span> <br />
              Intelligence
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto text-pretty">
              The premier platform for architecting sovereign, autonomous intelligence.
              Built for performance, polished for luxury.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Button asChild size="lg" className="btn-gradient px-10 py-7 text-lg rounded-2xl">
                <Link to="/login" className="flex items-center gap-2">
                  Launch Your Forge <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-10 py-7 text-lg rounded-2xl border-primary/20 bg-black/40 hover:bg-primary/5 hover:border-primary/40 text-primary transition-all">
                Explore Showcase
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<Cpu className="w-6 h-6" />}
            title="Elite Intelligence"
            description="Leverage top-tier models from Gemini and OpenAI, fine-tuned for high-performance Vox0-ki workflows."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Instant Capability"
            description="Toggle advanced toolsets including real-time search and database access with a single touch."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Sovereign Hosting"
            description="Global deployment on the edge with unmatched speed and military-grade persistence."
          />
        </div>
      </div>
      <footer className="py-12 border-t border-primary/10 text-center text-sm text-zinc-500 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-primary/80">© 2025 Vox0-ki. The Sovereign AI Workspace.</p>
          <p className="mt-2 text-xs opacity-50">
            AI capacity is subject to global availability. High-priority routing enabled for pro members.
          </p>
        </div>
      </footer>
    </div>
  );
}
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4 p-8 rounded-3xl border border-primary/10 bg-zinc-950/50 backdrop-blur-sm hover:border-primary/30 hover:bg-zinc-950 transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-glow">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}