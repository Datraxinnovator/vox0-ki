# Cloudflare Agents Chat Template

[![Deploy to Cloudflare][![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Datraxinnovator/vox0-ki)]

A production-ready full-stack chat application built on Cloudflare Workers using the Agents SDK. Features multi-session conversations, streaming AI responses, tool calling (web search, weather, MCP integration), and a modern responsive UI powered by React, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- **Multi-Session Chat**: Persistent conversations with session management via Durable Objects
- **AI-Powered**: Integrated with Cloudflare AI Gateway (supports Gemini models)
- **Streaming Responses**: Real-time message streaming for natural chat experience
- **Tool Calling**: Built-in tools for web search (SerpAPI), weather, and extensible MCP tools
- **Model Selection**: Switch between models like Gemini 2.5 Flash/Pro
- **Session Management**: List, create, delete, rename sessions with activity tracking
- **Modern UI**: Responsive design with shadcn/ui components, dark mode, and animations
- **Production-Ready**: Type-safe TypeScript, error handling, CORS, logging
- **Cloudflare Native**: Durable Objects for state, Workers for API, Pages for static assets

## 🛠️ Tech Stack

- **Backend**: Cloudflare Workers, Hono, Agents SDK, Durable Objects, OpenAI SDK
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router, Tanstack Query
- **AI/ML**: Cloudflare AI Gateway, Gemini models, tool calling
- **Tools**: SerpAPI (web search), MCP (Model Context Protocol)
- **State**: Zustand, Immer
- **UI Libs**: Lucide React, Framer Motion, Sonner (toasts)
- **Build**: Bun, Wrangler, Vitest

## ⚡ Quick Start

1. **Clone & Install**
   ```bash
   git clone <your-repo>
   cd agent-forge-builder-3y8elsdaowu9lwcr5aikr
   bun install
   ```

2. **Configure Environment**
   Set required secrets via Wrangler:
   ```bash
   bunx wrangler secret put CF_AI_API_KEY
   bunx wrangler secret put SERPAPI_KEY      # Optional: for web search
   bunx wrangler secret put OPENROUTER_API_KEY # Optional: for additional models
   ```
   
   Update `wrangler.jsonc` with your `CF_AI_BASE_URL` (format: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai`).

3. **Development**
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (or `PORT` env var).

4. **Deploy**
   ```bash
   bun run deploy
   ```

## 🔧 Local Development

- **Frontend**: `bun dev` (Vite dev server)
- **Backend**: Automatically runs via Wrangler integration
- **Type Generation**: `bun cf-typegen` (regenerate Worker types)
- **Linting**: `bun lint`
- **Build**: `bun build` (produces `dist/` for deployment)
- **Preview**: `bun preview`

Hot reload works for both frontend and Worker code. Sessions persist in development via Durable Objects (requires Wrangler dev mode).

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `CF_AI_BASE_URL` | ✅ | Cloudflare AI Gateway URL |
| `CF_AI_API_KEY` | ✅ | Cloudflare API token for AI |
| `SERPAPI_KEY` | ⚠️ | SerpAPI key for web search |
| `OPENROUTER_API_KEY` | ⚠️ | OpenRouter key for extra models |

## 📱 Usage

### Chat Sessions
- **New Chat**: Auto-creates session on first message
- **Switch Sessions**: `/api/sessions` lists all; UI manages switching
- **Actions**: Clear chat (`DELETE /clear`), Update model (`POST /model`)

### API Endpoints
All under `/api/` with CORS enabled:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/:sessionId/chat` | POST | Send message `{message: string, model?: string, stream?: boolean}` |
| `/api/chat/:sessionId/messages` | GET | Get chat state |
| `/api/sessions` | GET/POST/DELETE | List/create/clear sessions |
| `/api/sessions/:id` | DELETE | Delete session |
| `/api/sessions/:id/title` | PUT | Rename session |
| `/api/health` | GET | Health check |

### Customization
- **Extend Agent**: Modify `worker/agent.ts` or add tools in `worker/tools.ts`
- **UI**: Edit `src/pages/HomePage.tsx` and components in `src/components/`
- **Routes**: Add to `worker/userRoutes.ts`
- **Models/Tools**: Update `src/lib/chat.ts` and `worker/chat.ts`

## ☁️ Deployment

Deploy to Cloudflare Workers/Pages with one command:

```bash
bun run deploy
```

Or manually:
1. `bun build`
2. `bunx wrangler deploy`

**Automatic Assets**: Static frontend bundles to Cloudflare Pages. SPA routing handled via `assets` in `wrangler.jsonc`.

**[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Datraxinnovator/vox0-ki)**

### Production Checklist
- ✅ Set all secrets (`wrangler secret put`)
- ✅ Custom domain (via Cloudflare Dashboard)
- ✅ Observability enabled (logs, metrics)
- ✅ Durable Objects migrations auto-applied

## 🤝 Contributing

1. Fork & clone
2. `bun install`
3. `bun dev` for development
4. Submit PR with clear description

Report issues via GitHub Issues. Focus on Workers/Agents improvements.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Acknowledgments

Built on [Cloudflare Workers](https://workers.cloudflare.com/), [Agents SDK](https://developers.cloudflare.com/agents/), [shadcn/ui](https://ui.shadcn.com/), and open-source tools.

---

⭐ Star this repo if it helps! Questions? [Cloudflare Workers Discord](https://discord.gg/cloudflaredev)