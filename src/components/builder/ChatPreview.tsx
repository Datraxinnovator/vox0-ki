import React, { useState, useEffect, useRef } from 'react';
import { chatService, renderToolCall } from '@/lib/chat';
import { AgentConfig } from '@/lib/store';
import { Message } from '../../../worker/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, Sparkles, Terminal, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
interface ChatPreviewProps {
  agent: AgentConfig;
}
export function ChatPreview({ agent }: ChatPreviewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const toolCount = agent.tools.length;
  useEffect(() => {
    chatService.switchSession(agent.id);
    loadMessages();
  }, [agent.id]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);
  const loadMessages = async () => {
    const res = await chatService.getMessages();
    if (res.success && res.data) {
      setMessages(res.data.messages || []);
    }
  };
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const res = await chatService.sendMessage(userMsg.content, agent.model);
      if (res.success) {
        loadMessages();
      }
    } finally {
      setIsTyping(false);
    }
  };
  return (
    <div className="flex flex-col h-full overflow-hidden bg-black">
      <div className="h-14 border-b border-primary/10 px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,215,0,0.6)]" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Vox0-ki Neural Stream</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <Badge className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors font-mono text-[9px] px-3 flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            {toolCount}/4 PROTOCOLS ACTIVE
          </Badge>
        </div>
        {agent.systemPrompt && (
          <Badge variant="outline" className="text-[9px] border-primary/20 text-primary/60 font-mono hidden sm:flex">
            CUSTOM DIRECTIVES ACTIVE
          </Badge>
        )}
      </div>
      <ScrollArea className="flex-1 px-6 py-8">
        <div className="space-y-8 max-w-3xl mx-auto">
          {messages.length === 0 && !isTyping && (
            <div className="py-20 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-glow">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white tracking-tight">Vox0-ki Initialized</h4>
                <p className="text-zinc-500 text-xs max-w-xs mx-auto uppercase tracking-tighter font-bold">
                  Testing environment for {agent.name}. Execute first prompt to calibrate intelligence.
                </p>
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-4 items-start animate-fade-in", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                m.role === 'user' ? "bg-primary text-black border-primary/40 shadow-glow" : "bg-zinc-900 text-primary border-white/5")}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className="flex flex-col gap-2 max-w-[80%]">
                <div className={cn("p-4 rounded-2xl text-sm leading-relaxed",
                  m.role === 'user'
                    ? "bg-primary text-black font-semibold rounded-tr-none"
                    : "bg-zinc-900/40 text-white rounded-tl-none border border-white/5")}>
                  {m.content}
                </div>
                {m.toolCalls && m.toolCalls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {m.toolCalls.map((tc) => (
                      <div key={tc.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-primary/20 text-[10px] text-primary font-bold font-mono group">
                        <Terminal className="w-3 h-3 group-hover:animate-pulse" />
                        {renderToolCall(tc)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
              <div className="bg-zinc-900/20 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-10" />
        </div>
      </ScrollArea>
      <div className="p-6 border-t border-white/5 bg-zinc-950/80">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-3">
          <Input
            placeholder={`Execute directive...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-zinc-900/50 border-white/5 h-12 rounded-xl focus-visible:ring-primary/40 text-white placeholder:text-zinc-600"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={isTyping || !input.trim()} className="btn-gradient w-12 h-12 rounded-xl shrink-0">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}