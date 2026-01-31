import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '@/lib/chat';
import { AgentConfig } from '@/lib/store';
import { Message } from '../../../worker/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
interface ChatPreviewProps {
  agent: AgentConfig;
}
export function ChatPreview({ agent }: ChatPreviewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Switch to agent's session or create one
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="h-10 border-b border-white/5 px-4 flex items-center bg-secondary/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-2xs font-mono text-muted-foreground uppercase tracking-tighter">Live Preview Mode</span>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-2xl mx-auto">
          {messages.length === 0 && !isTyping && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Test {agent.name}</h4>
                <p className="text-sm text-muted-foreground">Send a message to see how your agent behaves with the current config.</p>
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", 
                m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn("max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                m.role === 'user' ? "bg-primary/10 text-foreground rounded-tr-none" : "bg-secondary/50 text-foreground rounded-tl-none border border-white/5")}>
                {m.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-secondary/50 p-3 rounded-2xl rounded-tl-none border border-white/5">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-white/10 bg-card/30">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-2">
          <Input 
            placeholder={`Message ${agent.name}...`} 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-secondary/50 border-white/5"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={isTyping || !input.trim()} className="btn-gradient shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-[10px] text-center mt-2 text-muted-foreground">
          Previews use actual AI credits. Limits apply.
        </p>
      </div>
    </div>
  );
}