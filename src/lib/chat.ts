import type { Message, ChatState, ToolCall } from '../../worker/types';
export interface ChatResponse {
  success: boolean;
  data?: ChatState;
  error?: string;
}
export const MODELS = [
  { id: 'google-ai-studio/gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'google-ai-studio/gemini-2.0-pro-exp', name: 'Gemini 2.0 Pro (Experimental)' },
  { id: 'google-ai-studio/gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  { id: 'google-ai-studio/gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
];
class ChatService {
  private sessionId: string;
  private baseUrl: string;
  constructor() {
    this.sessionId = crypto.randomUUID();
    this.baseUrl = `/api/chat/${this.sessionId}`;
  }
  private parseState(json: any): ChatState {
    const data = json.data || json;
    // Explicit warning if credentials seem missing from the response context
    if (data.systemPrompt?.includes('fallback protocol active')) {
      console.warn('Vox0-ki: Operating in Sandbox Mode. Configure CF_AI_API_KEY for real neural links.');
    }
    return {
      messages: data.messages || [],
      sessionId: data.sessionId || this.sessionId,
      isProcessing: !!data.isProcessing,
      streamingMessage: data.streamingMessage || '',
      model: data.model || 'google-ai-studio/gemini-2.0-flash',
      systemPrompt: data.systemPrompt || 'You are a Vox0-ki Agent.',
      enabledTools: data.enabledTools || []
    };
  }
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('/api/health');
      const json = await res.json();
      return !!json.success;
    } catch (e) {
      console.error('[NEURAL HEALTH CHECK FAILED]');
      return false;
    }
  }
  async sendMessage(
    message: string,
    model?: string,
    onChunk?: (chunk: string) => void
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model, stream: !!onChunk }),
      });
      if (!response.ok) {
        let errorMsg = 'Protocol transmission failure.';
        if (response.status === 429) errorMsg = 'Sovereign Capacity Exhausted (Rate Limit)';
        if (response.status === 502) errorMsg = 'Neural Link Interruption (Gateway Error)';
        if (response.status === 503) errorMsg = 'Global Mesh Busy (Service Unavailable)';
        return { success: false, error: errorMsg };
      }
      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk) onChunk(chunk);
          }
        } finally {
          reader.releaseLock();
        }
        return { success: true };
      } else {
        const json = await response.json();
        if (json.success) {
          return { success: true, data: this.parseState(json) };
        }
        return { success: false, error: json.error || 'Agent rejected directive.' };
      }
    } catch (error) {
      console.error('[CHAT SERVICE SEND ERROR]', error);
      return { success: false, error: 'Sovereign Network Interruption Detected.' };
    }
  }
  async updateSystemPrompt(systemPrompt: string): Promise<ChatResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/system-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt }),
      });
      const json = await res.json();
      return json.success ? { success: true, data: this.parseState(json) } : { success: false, error: 'Neural sync failed.' };
    } catch (e) {
      return { success: false, error: 'Sync timeout.' };
    }
  }
  async updateTools(tools: string[]): Promise<ChatResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools }),
      });
      const json = await res.json();
      return json.success ? { success: true, data: this.parseState(json) } : { success: false, error: 'Tool sync failed.' };
    } catch (e) {
      return { success: false, error: 'Tool sync timeout.' };
    }
  }
  async getMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`);
      if (!response.ok) return { success: false, error: 'Logs unavailable.' };
      const json = await response.json();
      return { success: true, data: this.parseState(json) };
    } catch (e) {
      return { success: false, error: 'Protocol trace lost.' };
    }
  }
  async clearMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, { method: 'DELETE' });
      const json = await response.json();
      return json.success ? { success: true, data: this.parseState(json) } : { success: false, error: 'Neural wipe failed.' };
    } catch (e) {
      return { success: false, error: 'Memory wipe failed.' };
    }
  }
  async updateModel(model: string): Promise<ChatResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model })
      });
      const json = await res.json();
      return json.success ? { success: true, data: this.parseState(json) } : { success: false, error: 'Model switch failed.' };
    } catch (e) {
      return { success: false, error: 'Model handshake timeout.' };
    }
  }
  generateDeploymentUrl(agentId: string): string {
    return `https://unit-${agentId.slice(0, 7)}.vox0-ki.link`;
  }
  getSessionId(): string { return this.sessionId; }
  switchSession(sessionId: string): void {
    this.sessionId = sessionId;
    this.baseUrl = `/api/chat/${sessionId}`;
  }
}
export const chatService = new ChatService();
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
export const renderToolCall = (toolCall: ToolCall): string => {
  const result = toolCall.result as any;
  const args = toolCall.arguments || {};
  if (!result) return `⏳ ${toolCall.name}: Executing...`;
  if ('error' in result) return `❌ ${toolCall.name}: Protocol Error`;
  switch (toolCall.name) {
    case 'get_weather': return `🌤️ ${result.location || 'Unknown'}: ${result.temperature ?? '??'}°C`;
    case 'web_search': return `🔍 Found: ${String(args.query || 'Results').slice(0, 15)}`;
    case 'd1_db': return `🗄️ Matrix: Sync success`;
    case 'mcp_server': return `⚡ Bridge: Handshake success`;
    default: return `🔧 ${toolCall.name}: Protocol complete`;
  }
};