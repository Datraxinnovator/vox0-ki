import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgentStore } from '@/lib/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, Copy, Star, Users } from 'lucide-react';
import { toast } from 'sonner';
const BLUEPRINTS = [
  { 
    id: 'b-1', 
    name: 'Code Auditor Elite', 
    role: 'Security Engineer', 
    downloads: '1.2k', 
    rating: 4.9, 
    tags: ['Security', 'Node.js'],
    config: {
      name: 'Code Auditor Elite',
      role: 'Security Engineer',
      systemPrompt: 'You are an elite cybersecurity specialist. Analyze code for vulnerabilities with precision.',
      tools: ['mcp_server', 'd1_db'],
      model: 'google-ai-studio/gemini-2.5-flash'
    }
  },
  { 
    id: 'b-2', 
    name: 'Market Intel Pro', 
    role: 'Financial Analyst', 
    downloads: '850', 
    rating: 4.8, 
    tags: ['Finance', 'Real-time'],
    config: {
      name: 'Market Intel Pro',
      role: 'Financial Analyst',
      systemPrompt: 'You are a high-frequency trading analyst. Monitor global markets and identify alpha.',
      tools: ['web_search', 'get_weather'],
      model: 'google-ai-studio/gemini-2.5-pro'
    }
  },
  { 
    id: 'b-3', 
    name: 'D1 Data Architect', 
    role: 'Database Admin', 
    downloads: '430', 
    rating: 5.0, 
    tags: ['Cloudflare', 'SQL'],
    config: {
      name: 'D1 Data Architect',
      role: 'Database Admin',
      systemPrompt: 'You are a database optimization engine. Structure schemas for maximum edge performance.',
      tools: ['d1_db'],
      model: 'google-ai-studio/gemini-2.0-flash'
    }
  },
];
export function GalleryPage() {
  const navigate = useNavigate();
  const cloneBlueprint = useAgentStore((s) => s.cloneBlueprint);
  const handleClone = (bp: typeof BLUEPRINTS[0]) => {
    const newId = cloneBlueprint(bp.config);
    toast.success(`${bp.name} architecture successfully cloned to your forge.`);
    navigate(`/builder/${newId}`);
  };
  return (
    <AppLayout container className="bg-black">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
            <Layers className="w-3 h-3" /> Community Forge
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Blueprint <span className="text-gradient">Gallery</span></h1>
          <p className="text-zinc-500 max-w-2xl">Discover and deploy verified intelligence architectures created by the Vox0-ki collective.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLUEPRINTS.map((bp) => (
            <Card key={bp.id} className="group border-primary/10 bg-zinc-950/40 backdrop-blur-md hover:border-primary/40 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-primary border border-white/5">
                    <Layers className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-primary/20 text-primary uppercase font-bold">
                    PREMIUM
                  </Badge>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">{bp.name}</CardTitle>
                <CardDescription className="text-zinc-500 font-medium">{bp.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {bp.tags.map(tag => (
                    <Badge key={tag} className="bg-black/40 border-white/5 text-zinc-400 text-[9px] px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-primary/60" /> {bp.downloads} CLONES
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-primary/60 fill-primary/20" /> {bp.rating}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  onClick={() => handleClone(bp)}
                  className="w-full bg-zinc-900 hover:bg-primary hover:text-black border border-white/5 font-bold rounded-xl transition-all"
                >
                  <Copy className="w-4 h-4 mr-2" /> Clone Architecture
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}