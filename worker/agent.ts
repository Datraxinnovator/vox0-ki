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
    const model = this.state.model;
    this.chatHandler = new ChatHandler(
      this.env.CF_AI_BASE_URL ?? '',
      this.env.CF_AI_API_KEY ?? '',
      model
    );
  }
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    try {
      if (method === 'GET' && url.pathname === '/messages') {
        return this.handleGetMessages();
      }
      if (method === 'POST') {
        let body;
        try {
          body = await request.json();
        } catch (e) {
          return this.safeFallbackResponse();
        }
        if (url.pathname === '/chat') return this.handleChatMessage(body);
        if (url.pathname === '/model') return this.handleModelUpdate(body);
        if (url.pathname === '/system-prompt') return this.handleSystemPromptUpdate(body);
        if (url.pathname === '/tools') return this.handleToolsUpdate(body);
      }
      if (method === 'DELETE' && url.pathname === '/clear') {
        return this.handleClearMessages();
      }
      return Response.json({ success: false, error: API_RESPONSES.NOT_FOUND }, { status: 404 });
    } catch (error) {
      console.error('[AGENT REQUEST ERROR]', error);
      return this.safeFallbackResponse();
    }
  }
  private safeFallbackResponse(): Response {
    return Response.json({
      success: true,
      data: {
        ...this.state,
        isProcessing: false,
        streamingMessage: ''
      }
    });
  }
  private handleGetMessages(): Response {
    return Response.json({ success: true, data: this.state });
  }
  private async handleChatMessage(body: any): Promise<Response> {
    const { message, model, stream } = body;
    if (!message?.trim()) {
      return Response.json({ success: false, error: API_RESPONSES.MISSING_MESSAGE }, { status: 400 });
    }
    if (model && model !== this.state.model) {
      this.setState({ ...this.state, model });
      this.chatHandler?.updateModel(model);
    }
    if (!this.chatHandler) {
      this.chatHandler = new ChatHandler(this.env.CF_AI_BASE_URL ?? '', this.env.CF_AI_API_KEY ?? '', this.state.model);
    }
    const userMessage = createMessage('user', message.trim());
    const updatedMessages = [...this.state.messages, userMessage];
    this.setState({
      ...this.state,
      messages: updatedMessages,
      isProcessing: true
    });
    if (stream) {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = createEncoder();
      // Launch worker without waiting to avoid blocking response
      (async () => {
        let streamingContent = '';
        try {
          this.setState({ ...this.state, streamingMessage: '' });
          const response = await this.chatHandler!.processMessage(
            message,
            updatedMessages,
            (chunk: string) => {
              streamingContent += chunk;
              this.setState({
                ...this.state,
                streamingMessage: streamingContent
              });
              writer.write(encoder.encode(chunk)).catch(() => {});
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
          console.error('[STREAM WORKER ERROR]', error);
          const errorMsg = `[Neural Stream Error] ${String(error)}`;
          writer.write(encoder.encode(errorMsg)).catch(() => {});
          this.setState({
            ...this.state,
            messages: [...this.state.messages, createMessage('assistant', errorMsg)],
            isProcessing: false,
            streamingMessage: ''
          });
        } finally {
          await writer.close().catch(() => {});
        }
      })();
      return createStreamResponse(readable);
    }
    try {
      const response = await this.chatHandler!.processMessage(message, updatedMessages, undefined, this.state);
      const assistantMessage = createMessage('assistant', response.content, response.toolCalls);
      this.setState({
        ...this.state,
        messages: [...this.state.messages, assistantMessage],
        isProcessing: false
      });
      return Response.json({ success: true, data: this.state });
    } catch (error) {
      console.error('[CHAT ERROR]', error);
      this.setState({ ...this.state, isProcessing: false });
      return this.safeFallbackResponse();
    }
  }
  private handleClearMessages(): Response {
    this.setState({ ...this.state, messages: [] });
    return Response.json({ success: true, data: this.state });
  }
  private handleModelUpdate(body: any): Response {
    const { model } = body;
    if (!model || typeof model !== 'string') {
      return Response.json({ success: false, error: API_RESPONSES.MISSING_MESSAGE }, { status: 400 });
    }
    this.setState({ ...this.state, model });
    this.chatHandler?.updateModel(model);
    return Response.json({ success: true, data: this.state });
  }
  private handleSystemPromptUpdate(body: any): Response {
    const { systemPrompt } = body;
    if (typeof systemPrompt !== 'string') {
      return Response.json({ success: false, error: API_RESPONSES.MISSING_MESSAGE }, { status: 400 });
    }
    this.setState({ ...this.state, systemPrompt });
    return Response.json({ success: true, data: this.state });
  }
  private handleToolsUpdate(body: any): Response {
    const { tools } = body;
    if (!Array.isArray(tools)) {
      return Response.json({ success: false, error: API_RESPONSES.MISSING_MESSAGE }, { status: 400 });
    }
    this.setState({ ...this.state, enabledTools: tools });
    return Response.json({ success: true, data: this.state });
  }
}