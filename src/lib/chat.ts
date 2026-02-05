import type { Message, ChatState, ToolCall, SessionInfo } from '../../worker/types';
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
  /** Sends a message to the agent neural stream */
  async sendMessage(
    message: string,
    model?: string,
    onChunk?: (chunk: string) => void
  ): Promise<ChatResponse> {
    try {
      console.log('Sending to', this.baseUrl, JSON.stringify({message}));
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model, stream: !!onChunk }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Neural link disrupted (${response.status}). Verify your gateway protocols.`
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
      }
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Protocol transmission failure. Check network connectivity.' };
    }
  }
  /** Updates the agent's core system directive */
  async updateSystemPrompt(systemPrompt: string): Promise<ChatResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/system-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Sync failed' };
    }
  }
  /** Synchronizes enabled intelligence tools */
  async updateTools(tools: string[]): Promise<ChatResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Tool sync failed' };
    }
  }
  /** Retrieves neural logs for the current session */
  async getMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`);
      return await response.json();
    } catch (e) {
      return { success: false, error: 'Logs unavailable' };
    }
  }
  /** Wipes neural logs from the active ledger */
  async clearMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, { method: 'DELETE' });
      return await response.json();
    } catch (e) {
      return { success: false, error: 'Wipe failed' };
    }
  }
  /** Mock helper to generate a sovereign unit URL */
  generateDeploymentUrl(agentId: string): string {
    return `https://unit-${agentId.slice(0, 7)}.vox0-ki.link`;
  }
  /** Status helper for model complexity levels */
  getNeuralStatus(modelId: string, toolsCount: number): string {
    const isPro = modelId.includes('pro');
    const fidelity = isPro ? 'Ultra High Fidelity' : 'High Fidelity';
    const context = toolsCount > 2 ? 'Multi-Path Logic' : 'Linear Logic';
    return `${fidelity} / ${context}`;
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
  const result = toolCall.result as any;
  if (!result) return `⏳ ${toolCall.name}: Processing...`;
  if ('error' in result) return `❌ ${toolCall.name}: Error`;
  switch (toolCall.name) {
    case 'get_weather': return `🌤️ ${result.location}: ${result.temperature}°C`;
    case 'web_search': return `🔍 Found: ${toolCall.arguments.query ? String(toolCall.arguments.query).slice(0, 15) : 'Intelligence'}`;
    case 'd1_db': return `🗄️ Matrix: Sync success`;
    case 'mcp_server': return `⚡ Bridge: Handshake success`;
    default: return `🔧 ${toolCall.name}: Executed`;
  }
};