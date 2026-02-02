import { Agent } from 'agents';
import type { Env } from './core-utils';
import type { ChatState } from './types';
import { ChatHandler } from './chat';
import { API_RESPONSES } from './config';
import { createMessage, createStreamResponse, createEncoder } from './utils';
export class ChatAgent extends Agent<Env, ChatState> {
  private chatHandler?: ChatHandler;
  initialState: ChatState = {
    messages: [],
    sessionId: crypto.randomUUID(),
    isProcessing: false,
    streamingMessage: '',
    model: 'google-ai-studio/gemini-2.5-flash',
    systemPrompt: 'You are a helpful AI assistant.',
    enabledTools: ['web_search', 'get_weather', 'd1_db', 'mcp_server']
  };
  async onStart(): Promise<void> {
    this.chatHandler = new ChatHandler(
      this.env.CF_AI_BASE_URL,
      this.env.CF_AI_API_KEY,
      this.state.model
    );
  }
  async onRequest(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const method = request.method;
      if (method === 'GET' && url.pathname === '/messages') {
        return this.handleGetMessages();
      }
      if (method === 'POST' && url.pathname === '/chat') {
        return this.handleChatMessage(await request.json());
      }
      if (method === 'DELETE' && url.pathname === '/clear') {
        return this.handleClearMessages();
      }
      if (method === 'POST' && url.pathname === '/model') {
        return this.handleModelUpdate(await request.json());
      }
      if (method === 'POST' && url.pathname === '/system-prompt') {
        return this.handleSystemPromptUpdate(await request.json());
      }
      if (method === 'POST' && url.pathname === '/tools') {
        return this.handleToolsUpdate(await request.json());
      }
      return Response.json({ success: false, error: API_RESPONSES.NOT_FOUND }, { status: 404 });
    } catch (error) {
      console.error('Request handling error:', error);
      return Response.json({ success: false, error: API_RESPONSES.INTERNAL_ERROR }, { status: 500 });
    }
  }
  private handleGetMessages(): Response {
    return Response.json({ success: true, data: this.state });
  }
  private async handleChatMessage(body: { message: string; model?: string; stream?: boolean }): Promise<Response> {
    const { message, model, stream } = body;
    if (!message?.trim()) {
      return Response.json({ success: false, error: API_RESPONSES.MISSING_MESSAGE }, { status: 400 });
    }
    if (model && model !== this.state.model) {
      this.setState({ ...this.state, model });
      this.chatHandler?.updateModel(model);
    }
    if (!this.chatHandler) {
      this.chatHandler = new ChatHandler(this.env.CF_AI_BASE_URL, this.env.CF_AI_API_KEY, this.state.model);
    }
    const userMessage = createMessage('user', message.trim());
    this.setState({
      ...this.state,
      messages: [...this.state.messages, userMessage],
      isProcessing: true
    });
    try {
      if (!this.chatHandler) throw new Error('Chat handler not initialized');
      if (stream) {
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = createEncoder();
        (async () => {
          try {
            this.setState({ ...this.state, streamingMessage: '' });
            const response = await this.chatHandler!.processMessage(
              message,
              this.state.messages,
              (chunk: string) => {
                this.setState({
                  ...this.state,
                  streamingMessage: (this.state.streamingMessage || '') + chunk
                });
                writer.write(encoder.encode(chunk));
              },
              this.state
            );
            const assistantMessage = createMessage('assistant', response.content, response.toolCalls);
            this.setState({
              ...this.state,
              messages: [...this.state.messages, assistantMessage],
              isProcessing: false,
              streamingMessage: ''
            });
          } catch (error) {
            console.error('Streaming error:', error);
            const errorMessage = 'Sorry, I encountered an error.';
            writer.write(encoder.encode(errorMessage));
            this.setState({
              ...this.state,
              messages: [...this.state.messages, createMessage('assistant', errorMessage)],
              isProcessing: false,
              streamingMessage: ''
            });
          } finally {
            writer.close();
          }
        })();
        return createStreamResponse(readable);
      }
      const response = await this.chatHandler.processMessage(message, this.state.messages, undefined, this.state);
      const assistantMessage = createMessage('assistant', response.content, response.toolCalls);
      this.setState({ ...this.state, messages: [...this.state.messages, assistantMessage], isProcessing: false });
      return Response.json({ success: true, data: this.state });
    } catch (error) {
      this.setState({ ...this.state, isProcessing: false });
      return Response.json({ success: false, error: API_RESPONSES.PROCESSING_ERROR }, { status: 500 });
    }
  }
  private handleClearMessages(): Response {
    this.setState({ ...this.state, messages: [] });
    return Response.json({ success: true, data: this.state });
  }
  private handleModelUpdate(body: { model: string }): Response {
    this.setState({ ...this.state, model: body.model });
    if (!this.chatHandler) {
      this.chatHandler = new ChatHandler(this.env.CF_AI_BASE_URL, this.env.CF_AI_API_KEY, body.model);
    }
    this.chatHandler.updateModel(body.model);
    return Response.json({ success: true, data: this.state });
  }
  private handleSystemPromptUpdate(body: { systemPrompt: string }): Response {
    this.setState({ ...this.state, systemPrompt: body.systemPrompt });
    return Response.json({ success: true, data: this.state });
  }
  private handleToolsUpdate(body: { tools: string[] }): Response {
    this.setState({ ...this.state, enabledTools: body.tools });
    return Response.json({ success: true, data: this.state });
  }
}