import type { Message, ChatState, ToolCall, WeatherResult, MCPResult, ErrorResult, SessionInfo } from '../../worker/types';
export interface ChatResponse {
  success: boolean;
  data?: ChatState;
  error?: string;
}
export const MODELS = [
  { id: 'google-ai-studio/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'google-ai-studio/gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'google-ai-studio/gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
];
class ChatService {
  private sessionId: string;
  private baseUrl: string;
  constructor() {
    this.sessionId = crypto.randomUUID();
    this.baseUrl = `/api/chat/${this.sessionId}`;
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
        const errorText = await response.text();
        console.error(`[CHAT_SERVICE ERROR] HTTP ${response.status}: ${errorText}`);
        return { 
          success: false, 
          error: `Server responded with ${response.status}. Please check your environment configuration.` 
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
        } catch (streamError) {
          console.error('[STREAM READ ERROR]', streamError);
        } finally {
          reader.releaseLock();
        }
        return { success: true };
      }
      return await response.json();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('[NETWORK ERROR]', errMsg);
      return { success: false, error: `Network connectivity failure: ${errMsg}` };
    }
  }
  async updateSystemPrompt(systemPrompt: string): Promise<ChatResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/system-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt }),
      });
      return await res.json();
    } catch (error) {
      return { success: false, error: 'Failed to sync prompt architecture' };
    }
  }
  async updateTools(tools: string[]): Promise<ChatResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools }),
      });
      return await res.json();
    } catch (error) {
      return { success: false, error: 'Failed to sync intelligence protocols' };
    }
  }
  async getMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Memory retrieval failed' };
    }
  }
  async clearMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, { method: 'DELETE' });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Memory wipe failed' };
    }
  }
  getSessionId(): string { return this.sessionId; }
  newSession(): void {
    this.sessionId = crypto.randomUUID();
    this.baseUrl = `/api/chat/${this.sessionId}`;
  }
  switchSession(sessionId: string): void {
    this.sessionId = sessionId;
    this.baseUrl = `/api/chat/${sessionId}`;
  }
  async createSession(title?: string, sessionId?: string, firstMessage?: string) {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sessionId, firstMessage })
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Session creation failed' };
    }
  }
  async listSessions() {
    try {
      const res = await fetch('/api/sessions');
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  }
  async deleteSession(sessionId: string) {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }
  async updateModel(model: string): Promise<ChatResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model })
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Model switch failed' };
    }
  }
}
export const chatService = new ChatService();
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
export const renderToolCall = (toolCall: ToolCall): string => {
  const result = toolCall.result as WeatherResult | { content: string } | ErrorResult | undefined;
  if (!result) return `⏳ ${toolCall.name}: Processing...`;
  if ('error' in result) return `��� ${toolCall.name}: Error`;
  if (toolCall.name === 'get_weather') {
    const w = result as WeatherResult;
    return `🌤️ ${w.location}: ${w.temperature}°C`;
  }
  return `🔧 ${toolCall.name}: Success`;
};