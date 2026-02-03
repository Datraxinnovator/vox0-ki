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
    this.mockMode = !aiGatewayUrl?.trim() || !apiKey?.trim();
    if(this.mockMode){
      console.log('ChatHandler: Sandbox mock mode');
      return;
    } else {
      this.client = new OpenAI({
        baseURL: aiGatewayUrl,
        apiKey: apiKey
      });
    }
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
    const messages = this.buildConversationMessages(message, conversationHistory, agentState?.systemPrompt);
    if(this.mockMode){
      return this.handleMockResponse(message, conversationHistory, onChunk, agentState);
    }
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
    if (onChunk) {
      const stream = await this.client.chat.completions.create(options) as unknown as Stream<OpenAI.Chat.Completions.ChatCompletionChunk>;
      return this.handleStreamResponse(stream, message, conversationHistory, onChunk, agentState?.systemPrompt);
    }
    const completion = await this.client.chat.completions.create(options);
    return this.handleNonStreamResponse(completion as OpenAI.Chat.Completions.ChatCompletion, message, conversationHistory, agentState?.systemPrompt);
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
      const delta = chunk.choices[0]?.delta;
      const content = delta?.content ?? '';
      if (content) {
        fullContent += content;
        onChunk(content);
      }
      const toolCallsDelta = delta?.tool_calls;
      if (toolCallsDelta && Array.isArray(toolCallsDelta)) {
        for (const dtc of toolCallsDelta) {
          if (dtc.index !== undefined && dtc.index >= 0) {
            const index = dtc.index;
            if (!accumulatedToolCalls[index]) {
              const initName = dtc.function?.name ?? '';
              const initArgs = dtc.function?.arguments ?? '';
              accumulatedToolCalls[index] = {
                id: dtc.id || `tool_${Date.now()}_${index}`,
                type: 'function',
                function: { name: initName, arguments: initArgs }
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
    if (Object.keys(accumulatedToolCalls).length > 0) {
      const executedTools = await this.executeToolCalls(Object.values(accumulatedToolCalls) as OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]);
      const finalResponse = await this.generateToolResponse(message, conversationHistory, Object.values(accumulatedToolCalls) as OpenAI.Chat.Completions.ChatCompletionMessageToolCall[], executedTools, systemPrompt);
      return { content: finalResponse, toolCalls: executedTools };
    }
    return { content: fullContent };
  }
  private async handleNonStreamResponse(
    completion: OpenAI.Chat.Completions.ChatCompletion,
    message: string,
    conversationHistory: Message[],
    systemPrompt?: string
  ) {
    const responseMessage = completion.choices[0]?.message;
    if (!responseMessage) return { content: 'Issue processing request.' };
    if (!responseMessage.tool_calls) return { content: responseMessage.content || 'No response.' };
    const toolCalls = await this.executeToolCalls(responseMessage.tool_calls);
    const finalResponse = await this.generateToolResponse(message, conversationHistory, responseMessage.tool_calls, toolCalls, systemPrompt);
    return { content: finalResponse, toolCalls };
  }
  private async executeToolCalls(openAiToolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]): Promise<ToolCall[]> {
    return Promise.all(openAiToolCalls.map(async (tc) => {
      try {
        const toolCall = tc as any;
        const name = toolCall.function?.name;
        const rawArgs = toolCall.function?.arguments;
        const args = rawArgs ? JSON.parse(rawArgs) : {};
        const result = await executeTool(name, args);
        return { id: tc.id, name, arguments: args, result };
      } catch (error) {
        const toolCall = tc as any;
        return { id: tc.id, name: toolCall.function?.name || 'unknown', arguments: {}, result: { error: String(error) } };
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
      return `Tools executed successfully. Mock response for ${toolResults.length} tool calls.`;
    }
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
    return followUp.choices[0]?.message?.content || 'Processed.';
  }
  private buildConversationMessages(userMessage: string, history: Message[], systemPrompt?: string) {
    return [
      { role: 'system' as const, content: systemPrompt || 'You are a Vox0-ki Intelligence Engine.' },
      ...history.slice(-10).map(m => ({ role: m.role as any, content: m.content })),
      { role: 'user' as const, content: userMessage }
    ];
  }
  private async handleMockResponse(message: string, conversationHistory: Message[], onChunk?: (chunk: string) => void, agentState?: ChatState): Promise<{content: string; toolCalls?: ToolCall[]}> {
    let mockContent = `🤖 Vox0-ki Sandbox Mock (Gemini ${this.model})\n\nYour input: ${message.slice(0, 100)}...\n\nActive tools: ${agentState?.enabledTools?.join(', ') || 'none'}\n\nSay 'weather' or 'search' to demo tools.`;
    const toolCalls: ToolCall[] = [];
    const lower = message.toLowerCase();
    if(lower.includes('weather')){
      const loc = lower.includes('sf')||lower.includes('san') ? 'San Francisco' : 'London';
      const fakeWeather = {location: loc, temperature: 22 + Math.floor(Math.random()*10), condition: 'Sunny', humidity: 65};
      toolCalls.push({id: 'mock-weather', name: 'get_weather', arguments: {location: loc}, result: fakeWeather});
      mockContent += `\n\n✅ Demo tool result: ${JSON.stringify(fakeWeather)};`;
    } else if(lower.includes('search') || lower.includes('web')){
      const fakeSearch = {content: `Mock web_search: Found results for '${message}'.\n1. google.com/search?q=${encodeURIComponent(message.slice(0,50))} (top result)\n2. Mock site: relevant info.` };
      toolCalls.push({id: 'mock-search', name: 'web_search', arguments: {query:message}, result: fakeSearch});
      mockContent += `\n\n🔍 Demo search complete.`;
    }
    if(onChunk){
      const words = mockContent.split(/\s+/);
      for(const word of words.slice(0, 150)){ // limit
        await new Promise(r => setTimeout(r, 20 + Math.random()*30));
        onChunk(word + ' ');
      }
      return {content: mockContent, toolCalls: toolCalls.length ? toolCalls : undefined};
    }
    return {content: mockContent, toolCalls: toolCalls.length ? toolCalls : undefined};
  }

  updateModel(newModel: string): void {
    this.model = newModel;
  }
}