import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
export function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login({ id: 'user-1', email, name: email.split('@')[0] });
      toast.success('Successfully logged in');
      navigate('/dashboard');
    } else {
      toast.error('Please fill in all fields');
    }
  };
  return (
    <div className="min-h-screen flex items-stretch bg-background">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-1 relative bg-neutral-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-rainbow opacity-20" />
        <div className="relative z-10 text-center space-y-6 px-12">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold text-white">Join the Intelligence Revolution</h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Design and deploy sophisticated AI agents in minutes. Access global compute and the world's most capable models.
          </p>
        </div>
      </div>
      {/* Right: Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="absolute top-8 left-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Card className="w-full max-w-md border-white/5 bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your agents</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/50 border-input"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-input"
                />
              </div>
              <Button type="submit" className="w-full btn-gradient py-6 text-base rounded-xl font-semibold">
                Sign In
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account? <span className="text-primary hover:underline cursor-pointer">Sign up</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}