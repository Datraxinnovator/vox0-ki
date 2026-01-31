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
    { name: 'agent-forge-auth' }
  )
);
export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: [
        {
          id: 'default-1',
          name: 'Research Assistant',
          role: 'Researcher',
          systemPrompt: 'You are a professional research assistant. Use web search to find accurate data.',
          model: 'google-ai-studio/gemini-2.5-flash',
          tools: ['web_search'],
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
    { name: 'agent-forge-agents' }
  )
);