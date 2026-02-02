import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
export function AuthPage() {
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      useAuthStore.getState().login({ id: 'user-1', email, name: email.split('@')[0] });
      toast.success('Welcome to the elite workspace');
      navigate('/dashboard');
    } else {
      toast.error('Identity verification failed');
    }
  };
  return (
    <div className="min-h-screen flex items-stretch bg-black">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-1 relative bg-black items-center justify-center overflow-hidden border-r border-primary/10">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative z-10 text-center space-y-8 px-16">
          <div className="w-24 h-24 mx-auto rounded-[2.5rem] bg-gradient-primary flex items-center justify-center shadow-glow border border-primary/40 floating">
            <Sparkles className="w-12 h-12 text-black" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-display font-bold text-white tracking-tight">Vox0-ki <span className="text-primary">Sovereign</span></h2>
            <p className="text-zinc-500 text-lg max-w-md mx-auto leading-relaxed">
              Step into the world's most sophisticated AI forge. Pure power, wrapped in elegance.
            </p>
          </div>
          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-primary text-2xl font-bold font-mono">100%</div>
              <div className="text-zinc-600 text-xs uppercase tracking-widest font-bold">Persistence</div>
            </div>
            <div className="text-center">
              <div className="text-primary text-2xl font-bold font-mono">24/7</div>
              <div className="text-zinc-600 text-xs uppercase tracking-widest font-bold">Execution</div>
            </div>
          </div>
        </div>
      </div>
      {/* Right: Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 text-zinc-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Entry
        </Button>
        <Card className="w-full max-w-md border-primary/20 bg-zinc-950/40 backdrop-blur-2xl shadow-2xl rounded-[2rem]">
          <CardHeader className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mx-auto mb-2 text-primary border border-primary/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Neural Gateway</CardTitle>
            <CardDescription className="text-zinc-500">Secure entry to the Vox0-ki Control Plane</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 border-primary/10 h-14 rounded-xl focus-visible:ring-primary focus-visible:border-primary/40 text-white"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Access Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border-primary/10 h-14 rounded-xl focus-visible:ring-primary focus-visible:border-primary/40 text-white"
                />
              </div>
              <Button type="submit" className="w-full btn-gradient py-7 text-lg rounded-2xl font-bold mt-4 shadow-lg shadow-primary/10">
                Grant Access
              </Button>
            </form>
            <div className="mt-8 text-center text-sm text-zinc-600">
              New architect? <span className="text-primary hover:underline cursor-pointer font-bold">Request Invitations</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}