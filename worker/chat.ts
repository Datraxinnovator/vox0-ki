import OpenAI from 'openai';
import type { Message, ToolCall, ChatState } from './types';
import { getToolDefinitions, executeTool } from './tools';
import { Stream } from 'openai/streaming';
export class ChatHandler {
  private client?: OpenAI;
  private model: string;
  private mockMode: boolean = false;
  constructor(aiGatewayUrl: string, apiKey: string, model: string) {
    this.model = model;
    this.mockMode = !aiGatewayUrl?.trim() || !apiKey?.trim() || aiGatewayUrl?.toLowerCase().includes('YOUR') || aiGatewayUrl?.toLowerCase().includes('YOUR_ACCOUNT_ID') || apiKey?.toLowerCase().includes('your');
    if (this.mockMode) {
      console.log('ChatHandler: Sandbox Mode (Mocking API)');
      return;
    }
    this.client = new OpenAI({
      baseURL: aiGatewayUrl,
      apiKey: apiKey
    });
  }
  async processMessage(
    message: string,
    conversationHistory: Message[],
    onChunk?: (chunk: string) => void,
    agentState?: ChatState
  ): Promise<{
    content: string;
    toolCalls?: ToolCall[];
  }> {
    if (this.mockMode) {
      return this.handleMockResponse(message, conversationHistory, onChunk, agentState);
    }
    const messages = this.buildConversationMessages(message, conversationHistory, agentState?.systemPrompt);
    const allTools = await getToolDefinitions();
    const enabledTools = agentState?.enabledTools || [];
    const toolDefinitions = allTools.filter(td => enabledTools.includes(td.function.name));
    const options: any = {
      model: this.model,
      messages,
      max_completion_tokens: 16000,
      stream: !!onChunk,
    };
    if (toolDefinitions.length > 0) {
      options.tools = toolDefinitions;
      options.tool_choice = 'auto';
    }
    try {
      if (onChunk) {
        const stream = await this.client!.chat.completions.create(options) as unknown as Stream<OpenAI.Chat.Completions.ChatCompletionChunk>;
        return this.handleStreamResponse(stream, message, conversationHistory, onChunk, agentState?.systemPrompt);
      }
      const completion = await this.client!.chat.completions.create(options);
      return this.handleNonStreamResponse(completion as OpenAI.Chat.Completions.ChatCompletion, message, conversationHistory, agentState?.systemPrompt);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return await this.handleMockResponse(message, conversationHistory, onChunk, agentState);
    }
  }
  private async handleStreamResponse(
    stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>,
    message: string,
    conversationHistory: Message[],
    onChunk: (chunk: string) => void,
    systemPrompt?: string
  ) {
    let fullContent = '';
    const accumulatedToolCalls: any[] = [];
    for await (const chunk of stream) {
      const choice = chunk.choices?.[0];
      if (!choice) continue;
      const delta = choice.delta;
      if (!delta) continue;
      const content = delta.content ?? '';
      if (content) {
        fullContent += content;
        onChunk(content);
      }
      const toolCallsDelta = delta.tool_calls;
      if (toolCallsDelta && Array.isArray(toolCallsDelta)) {
        for (const dtc of toolCallsDelta) {
          if (dtc.index !== undefined) {
            const index = dtc.index;
            if (!accumulatedToolCalls[index]) {
              accumulatedToolCalls[index] = {
                id: dtc.id,
                function: {
                  name: dtc.function?.name || '',
                  arguments: dtc.function?.arguments || ''
                }
              };
            } else if (dtc.function) {
              if (dtc.function.name) accumulatedToolCalls[index].function.name += dtc.function.name;
              if (dtc.function.arguments) accumulatedToolCalls[index].function.arguments += dtc.function.arguments;
            }
          }
        }
      }
    }
    if (accumulatedToolCalls.length > 0) {
      const validToolCalls = accumulatedToolCalls.filter(tc => tc && tc.function);
      const toolResults = await this.executeToolCalls(validToolCalls as any[]);
      const finalResponse = await this.generateToolResponse(message, conversationHistory, validToolCalls as any[], toolResults, systemPrompt);
      return { content: finalResponse, toolCalls: toolResults };
    }
    return { content: fullContent };
  }
  private async handleNonStreamResponse(
    completion: OpenAI.Chat.Completions.ChatCompletion,
    message: string,
    conversationHistory: Message[],
    systemPrompt?: string
  ) {
    const responseMessage = completion.choices?.[0]?.message;
    if (!responseMessage) return { content: 'Issue processing request.' };
    if (!responseMessage.tool_calls || responseMessage.tool_calls.length === 0) {
      return { content: responseMessage.content || 'No response.' };
    }
    const toolResults = await this.executeToolCalls(responseMessage.tool_calls);
    const finalResponse = await this.generateToolResponse(message, conversationHistory, responseMessage.tool_calls, toolResults, systemPrompt);
    return { content: finalResponse, toolCalls: toolResults };
  }
  private async executeToolCalls(openAiToolCalls: any[]): Promise<ToolCall[]> {
    return Promise.all(openAiToolCalls.map(async (tc) => {
      const func = (tc as any).function;
      const name = func?.name || 'unknown';
      try {
        const args = JSON.parse(func?.arguments || '{}');
        const result = await executeTool(name, args);
        return { id: tc.id, name, arguments: args, result };
      } catch (error) {
        return { id: tc.id, name, arguments: {}, result: { error: String(error) } };
      }
    }));
  }
  private async generateToolResponse(
    userMsg: string,
    history: Message[],
    toolCalls: any[],
    toolResults: ToolCall[],
    systemPrompt?: string
  ): Promise<string> {
    if (!this.client || this.mockMode) return 'Tool execution successful.';
    try {
      const followUp = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt || 'You are a Vox0-ki Agent.' },
          ...history.slice(-5).map(m => ({ role: m.role as any, content: m.content })),
          { role: 'user', content: userMsg },
          { role: 'assistant', content: null, tool_calls: toolCalls },
          ...toolResults.map((res, i) => ({
            role: 'tool' as const,
            content: JSON.stringify(res.result),
            tool_call_id: toolCalls[i]?.id || res.id
          }))
        ]
      });
      return followUp.choices[0]?.message?.content || 'Done.';
    } catch (e) {
      return `Tool execution complete. Result summary: ${toolResults.map(r => r.name).join(', ')}.`;
    }
  }
  private buildConversationMessages(userMessage: string, history: Message[], systemPrompt?: string) {
    return [
      { role: 'system' as const, content: systemPrompt || 'You are a Vox0-ki Intelligence Engine.' },
      ...history.slice(-10).map(m => ({ role: m.role as any, content: m.content })),
      { role: 'user' as const, content: userMessage }
    ];
  }
  private async handleMockResponse(message: string, conversationHistory: Message[], onChunk?: (chunk: string) => void, agentState?: ChatState): Promise<{content: string; toolCalls?: ToolCall[]}> {
    const msg = message.toLowerCase();
    let mockContent = `[Vox0-ki Neural Link: Sandbox Mode]\n\nDirective received for unit ${agentState?.sessionId?.slice(0, 8) || 'SOVEREIGN'}.\nExecuting using protocol ${this.model}...\n\n`;
    const toolCalls: ToolCall[] = [];
    if (msg.includes('weather')) {
      toolCalls.push({ id: 'm-w-1', name: 'get_weather', arguments: { location: 'San Francisco' }, result: { location: 'San Francisco', temperature: 22, condition: 'Clear', humidity: 45 } });
      mockContent += "Atmospheric data retrieved successfully. Conditions are optimal for execution.";
    } else if (msg.includes('search') || msg.includes('oracle')) {
      toolCalls.push({ id: 'm-s-1', name: 'web_search', arguments: { query: message }, result: { content: "Top results indicate that Vox0-ki is the leading platform for sovereign AI development. Industry trends show a move towards autonomous agentic workflows at the edge." } });
      mockContent += "Web Oracle synchronized. Knowledge graph updated with real-time intelligence.";
    } else if (msg.includes('d1') || msg.includes('database') || msg.includes('matrix')) {
      toolCalls.push({ id: 'm-d-1', name: 'd1_db', arguments: { query: 'SELECT * FROM intelligence_ledger' }, result: { content: "✅ D1 Matrix synchronization successful. Query processed. Transaction Hash: 0xMOCK-LE-777." } });
      mockContent += "D1 Matrix query executed. Persistent ledger updated across 310+ nodes.";
    } else if (msg.includes('mcp') || msg.includes('bridge')) {
      toolCalls.push({ id: 'm-m-1', name: 'mcp_server', arguments: { action: 'call', endpoint: 'external-protocol-v1' }, result: { content: "⚡ MCP Bridge active. Tunnel established via sovereign gateway." } });
      mockContent += "MCP Bridge protocol initialized. External system handshake complete.";
    } else {
      mockContent += "Directive processed. Sovereign protocols verified. Intelligence stream established.";
    }
    if (onChunk) {
      const words = mockContent.split(' ');
      for (const word of words) {
        await new Promise(r => setTimeout(r, 40)); // Simulated neural latency
        onChunk(word + ' ');
      }
    }
    return { content: mockContent, toolCalls: toolCalls.length ? toolCalls : undefined };
  }
  updateModel(newModel: string): void {
    this.model = newModel;
  }
}