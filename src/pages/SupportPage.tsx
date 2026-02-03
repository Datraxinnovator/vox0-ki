import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { LifeBuoy, Send, MessageSquare, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
const supportSchema = z.object({
  subject: z.string().min(5, 'Subject is too brief.'),
  description: z.string().min(20, 'Please provide more architectural context.'),
});
type SupportForm = z.infer<typeof supportSchema>;
export function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SupportForm>({
    resolver: zodResolver(supportSchema)
  });
  const onSubmit = async (data: SupportForm) => {
    setIsLoading(true);
    // Simulate API dispatch
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    setSubmitted(true);
    toast.success('High-priority support request dispatched.');
    reset();
  };
  return (
    <AppLayout container className="bg-black">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest mx-auto">
            <LifeBuoy className="w-3 h-3" /> Concierge Services
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Concierge <span className="text-gradient">Support</span></h1>
          <p className="text-zinc-500 max-w-xl mx-auto">Direct access to elite engineers. Guaranteed response within the sovereign window (2h).</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 border-primary/10 bg-zinc-950/40 backdrop-blur-md overflow-hidden">
            <CardContent className="p-8">
              {!submitted ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Inquiry Subject</label>
                    <Input 
                      {...register('subject')} 
                      placeholder="e.g. D1 Replication Latency" 
                      className="bg-black border-white/10 h-12 rounded-xl text-white" 
                    />
                    {errors.subject && <p className="text-red-500 text-[10px] font-bold italic">{errors.subject.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Architectural Context</label>
                    <Textarea 
                      {...register('description')} 
                      placeholder="Explain your technical requirement..." 
                      className="bg-black border-white/10 min-h-[150px] rounded-xl text-white resize-none" 
                    />
                    {errors.description && <p className="text-red-500 text-[10px] font-bold italic">{errors.description.message}</p>}
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full btn-gradient py-7 rounded-2xl font-bold shadow-glow">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Dispatch Request</>}
                  </Button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 text-primary">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Request Dispatched</h3>
                    <p className="text-zinc-500">Your high-priority ticket has been added to the secure engineer queue.</p>
                  </div>
                  <Button variant="link" onClick={() => setSubmitted(false)} className="text-primary font-bold">Log another inquiry</Button>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-zinc-950 border border-primary/10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <MessageSquare className="w-5 h-5" />
                <h4 className="font-bold uppercase tracking-tight">Direct Link</h4>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Enterprise tier architects have direct access to encrypted Slack and Discord channels.</p>
              <Button variant="outline" className="w-full border-primary/20 text-primary rounded-xl h-11 text-xs font-bold hover:bg-primary/5">Join Sovereign HQ</Button>
            </div>
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-bold uppercase tracking-tight">VIP Priority</h4>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Your session is currently prioritized for ultra-low latency engineer routing.</p>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                <div className="h-full bg-primary w-full shadow-[0_0_10px_#FFD700]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}