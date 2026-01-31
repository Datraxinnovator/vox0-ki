import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Cpu, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <ThemeToggle />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-rainbow opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Next-Gen Agent Builder is live</span>
            </div>
            <h1 className="text-display font-bold tracking-tight">
              Build Intelligent <span className="text-gradient">AI Agents</span> <br />
              Without Writing Code
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              AgentForge empowers you to design, deploy, and scale autonomous AI agents 
              equipped with powerful tools and modern language models in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="btn-gradient px-8 py-6 text-lg rounded-xl">
                <Link to="/login" className="flex items-center gap-2">
                  Start Building Now <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-xl border-white/10 hover:bg-white/5">
                View Templates
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Cpu className="w-6 h-6" />}
            title="Multi-Model Support"
            description="Choose from Gemini, GPT-4o, and specialized open-source models for your agent's core brain."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6" />}
            title="Instant Toolkits"
            description="Easily enable Web Search, D1 Database access, and custom MCP tools with simple toggles."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6" />}
            title="Production Ready"
            description="Deploy agents directly to Cloudflare Workers with built-in observability and state persistence."
          />
        </div>
      </div>
      <footer className="py-12 border-t border-white/5 text-center text-sm text-muted-foreground">
        <p>© 2025 AgentForge Builder. Built on Cloudflare Agents.</p>
        <p className="mt-2 text-xs opacity-60">
          Note: AI request limits apply based on global server capacity.
        </p>
      </footer>
      <Toaster richColors closeButton />
    </div>
  );
}
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4 p-6 rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}