import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export interface User {
  id: string;
  email: string;
  name: string;
}
export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  model: string;
  tools: string[];
  lastEdited: number;
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}
interface AgentState {
  agents: AgentConfig[];
  addAgent: (agent: AgentConfig) => void;
  updateAgent: (id: string, updates: Partial<AgentConfig>) => void;
  deleteAgent: (id: string) => void;
  getAgent: (id: string) => AgentConfig | undefined;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'vox0-ki-auth' }
  )
);
export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: [
        {
          id: 'vox-1',
          name: 'Vox0-ki Research Strategist',
          role: 'Intelligence Architect',
          systemPrompt: 'You are a Vox0-ki Intelligence Engine. Execute all directives with extreme precision and utilize premium protocols.',
          model: 'google-ai-studio/gemini-2.5-flash',
          tools: ['web_search', 'get_weather', 'd1_db', 'mcp_server'],
          lastEdited: Date.now(),
        }
      ],
      addAgent: (agent) => set((state) => ({ agents: [agent, ...state.agents] })),
      updateAgent: (id, updates) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === id ? { ...a, ...updates, lastEdited: Date.now() } : a
          ),
        })),
      deleteAgent: (id) =>
        set((state) => ({
          agents: state.agents.filter((a) => a.id !== id),
        })),
      getAgent: (id) => get().agents.find((a) => a.id === id),
    }),
    { name: 'vox0-ki-agents' }
  )
);