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
    this.mockMode = !aiGatewayUrl?.trim() || !apiKey?.trim() || aiGatewayUrl.includes('YOUR_ACCOUNT_ID');
    if (this.mockMode) {
      console.log('ChatHandler: Operating in Sandbox Mock Mode (No API keys provided)');
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
    // 1. Absolute first check: Mock Mode bypass
    if (this.mockMode) {
      return this.handleMockResponse(message, conversationHistory, onChunk, agentState);
    }
    const messages = this.buildConversationMessages(message, conversationHistory, agentState?.systemPrompt);
    const allToolDefinitions = await getToolDefinitions();
    const enabledTools = agentState?.enabledTools || [];
    const toolDefinitions = allToolDefinitions.filter(td => enabledTools.includes(td.function.name));
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
      throw error;
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
      // TS2532 Fix: Strict null-checks for choices
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
          if (dtc.index !== undefined && dtc.index >= 0) {
            const index = dtc.index;
            if (!accumulatedToolCalls[index]) {
              accumulatedToolCalls[index] = {
                id: dtc.id || `tool_${Date.now()}_${index}`,
                type: 'function',
                function: { 
                  name: dtc.function?.name ?? '', 
                  arguments: dtc.function?.arguments ?? '' 
                }
              };
            } else {
              const functionDelta = dtc.function;
              if (functionDelta) {
                if (functionDelta.name) accumulatedToolCalls[index].function.name = functionDelta.name;
                if (functionDelta.arguments) accumulatedToolCalls[index].function.arguments += functionDelta.arguments;
              }
            }
          }
        }
      }
    }
    if (accumulatedToolCalls.length > 0) {
      const toolResults = await this.executeToolCalls(accumulatedToolCalls.filter(Boolean) as OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]);
      const finalResponse = await this.generateToolResponse(message, conversationHistory, accumulatedToolCalls.filter(Boolean) as OpenAI.Chat.Completions.ChatCompletionMessageToolCall[], toolResults, systemPrompt);
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
    if (!responseMessage) return { content: 'Issue processing request: No message returned.' };
    if (!responseMessage.tool_calls || responseMessage.tool_calls.length === 0) {
      return { content: responseMessage.content || 'No response content.' };
    }
    const toolResults = await this.executeToolCalls(responseMessage.tool_calls);
    const finalResponse = await this.generateToolResponse(message, conversationHistory, responseMessage.tool_calls, toolResults, systemPrompt);
    return { content: finalResponse, toolCalls: toolResults };
  }
  private async executeToolCalls(openAiToolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]): Promise<ToolCall[]> {
    return Promise.all(openAiToolCalls.map(async (tc) => {
      const name = tc.function?.name || 'unknown';
      try {
        const rawArgs = tc.function?.arguments;
        const args = rawArgs ? JSON.parse(rawArgs) : {};
        const result = await executeTool(name, args);
        return { id: tc.id, name, arguments: args, result };
      } catch (error) {
        console.warn(`Tool execution failed for ${name}:`, error);
        return { id: tc.id, name, arguments: {}, result: { error: String(error) } };
      }
    }));
  }
  private async generateToolResponse(
    userMessage: string,
    history: Message[],
    openAiToolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
    toolResults: ToolCall[],
    systemPrompt?: string
  ): Promise<string> {
    if (this.mockMode || !this.client) {
      return `[MOCK MODE] Tools executed: ${toolResults.map(t => t.name).join(', ')}. Logic simulation complete.`;
    }
    try {
      const followUp = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt || 'You are a Vox0-ki Intelligence Engine.' },
          ...history.slice(-5).map(m => ({ role: m.role as any, content: m.content })),
          { role: 'user', content: userMessage },
          { role: 'assistant', content: null, tool_calls: openAiToolCalls },
          ...toolResults.map((result, index) => ({
            role: 'tool' as const,
            content: JSON.stringify(result.result),
            tool_call_id: openAiToolCalls[index]?.id || result.id
          }))
        ],
        max_tokens: 16000
      });
      return followUp.choices[0]?.message?.content || 'Processed tool response.';
    } catch (error) {
      console.error('Follow-up generation failed:', error);
      return `I processed the tools, but encountered an error generating the final summary: ${String(error)}`;
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
    let mockContent = `🤖 [Vox0-ki Neural Link: Sandbox Mode]\nModel: ${this.model}\n\nProcessed directive: "${message.slice(0, 50)}${message.length > 50 ? '...' : ''}"\n\nSystem protocols active: ${agentState?.enabledTools?.length || 0}\n\nNeural stream simulation initialized...`;
    const toolCalls: ToolCall[] = [];
    const lower = message.toLowerCase();
    if (lower.includes('weather')) {
      const fakeWeather = { location: 'San Francisco', temperature: 22, condition: 'Sunny', humidity: 65 };
      toolCalls.push({ id: 'mock-w-1', name: 'get_weather', arguments: { location: 'San Francisco' }, result: fakeWeather });
      mockContent += `\n\n[PROTOCOL: METEO_STREAM] Data retrieved for San Francisco: 22°C, Sunny.`;
    } else if (lower.includes('search') || lower.includes('web')) {
      const fakeSearch = { content: 'Mock search result: The Vox0-ki architecture is operating at peak efficiency.' };
      toolCalls.push({ id: 'mock-s-1', name: 'web_search', arguments: { query: message }, result: fakeSearch });
      mockContent += `\n\n[PROTOCOL: WEB_ORACLE] Search index synchronized.`;
    } else if (lower.includes('db') || lower.includes('sql')) {
      const fakeDb = { content: 'Rows affected: 0. Query: ' + message };
      toolCalls.push({ id: 'mock-db-1', name: 'd1_db', arguments: { query: message }, result: fakeDb });
      mockContent += `\n\n[PROTOCOL: D1_MATRIX] Ledger state verified.`;
    }
    if (onChunk) {
      const words = mockContent.split(' ');
      for (const word of words) {
        await new Promise(r => setTimeout(r, 15));
        onChunk(word + ' ');
      }
    }
    return { content: mockContent, toolCalls: toolCalls.length ? toolCalls : undefined };
  }
  updateModel(newModel: string): void {
    this.model = newModel;
  }
}