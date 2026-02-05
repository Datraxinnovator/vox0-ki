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
        return {
          success: false,
          error: `Transmission failure: ${response.status}`
        };
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
        return { success: false, error: json.error || 'Agent rejected request' };
      }
    } catch (error) {
      console.error('[CHAT SERVICE SEND ERROR]', error);
      return { success: false, error: 'Protocol transmission failure.' };
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
      return json.success ? { success: true, data: this.parseState(json) } : { success: false, error: 'Sync failed' };
    } catch (e) {
      return { success: false, error: 'Sync timeout' };
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
      return json.success ? { success: true, data: this.parseState(json) } : { success: false, error: 'Tool sync failed' };
    } catch (e) {
      return { success: false, error: 'Tool sync timeout' };
    }
  }
  async getMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`);
      if (!response.ok) return { success: false, error: 'Logs unavailable' };
      const json = await response.json();
      return { success: true, data: this.parseState(json) };
    } catch (e) {
      return { success: false, error: 'Logs unavailable' };
    }
  }
  async clearMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, { method: 'DELETE' });
      const json = await response.json();
      return json.success ? { success: true, data: this.parseState(json) } : { success: false, error: 'Wipe failed' };
    } catch (e) {
      return { success: false, error: 'Wipe failed' };
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
      return json.success ? { success: true, data: this.parseState(json) } : { success: false, error: 'Model switch failed' };
    } catch (e) {
      return { success: false, error: 'Model switch timeout' };
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
  if (!result) return `⏳ ${toolCall.name}: Processing...`;
  if ('error' in result) return `❌ ${toolCall.name}: Error`;
  switch (toolCall.name) {
    case 'get_weather': return `🌤️ ${result.location || 'Unknown'}: ${result.temperature ?? '??'}°C`;
    case 'web_search': return `🔍 Found: ${String(args.query || 'Results').slice(0, 15)}`;
    case 'd1_db': return `🗄️ Matrix: Sync success`;
    case 'mcp_server': return `⚡ Bridge: Handshake success`;
    default: return `🔧 ${toolCall.name}: Executed`;
  }
};