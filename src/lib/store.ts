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
export interface Secret {
  id: string;
  name: string;
  value: string;
  lastRotated: string;
}
export interface SystemSettings {
  defaultModel: string;
  creativityBias: number;
  enableAnimations: boolean;
  enableGlow: boolean;
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
  cloneBlueprint: (blueprint: Partial<AgentConfig>) => string;
  updateAgent: (id: string, updates: Partial<AgentConfig>) => void;
  deleteAgent: (id: string) => void;
  getAgent: (id: string) => AgentConfig | undefined;
}
interface VaultState {
  secrets: Secret[];
  addSecret: (secret: Omit<Secret, 'id' | 'lastRotated'>) => void;
  deleteSecret: (id: string) => void;
}
interface SettingsState {
  settings: SystemSettings;
  updateSettings: (updates: Partial<SystemSettings>) => void;
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
          lastEdited: 1738552068000,
        }
      ],
      addAgent: (agent) => set((state) => ({ agents: [agent, ...state.agents] })),
      cloneBlueprint: (blueprint) => {
        const id = crypto.randomUUID();
        const newAgent: AgentConfig = {
          id,
          name: blueprint.name || 'Cloned Unit',
          role: blueprint.role || 'General Intel',
          systemPrompt: blueprint.systemPrompt || 'You are an AI.',
          model: blueprint.model || 'google-ai-studio/gemini-2.5-flash',
          tools: blueprint.tools || [],
          lastEdited: Date.now(),
        };
        set((state) => ({ agents: [newAgent, ...state.agents] }));
        return id;
      },
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
export const useVaultStore = create<VaultState>()(
  persist(
    (set) => ({
      secrets: [
        { id: 's-1', name: 'OPENAI_API_KEY', value: 'sk-***•••••••••••', lastRotated: '2 days ago' },
      ],
      addSecret: (s) => set((state) => ({
        secrets: [
          ...state.secrets,
          { ...s, id: crypto.randomUUID(), lastRotated: 'Just now' }
        ]
      })),
      deleteSecret: (id) => set((state) => ({
        secrets: state.secrets.filter(s => s.id !== id)
      })),
    }),
    { name: 'vox0-ki-vault' }
  )
);
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        defaultModel: 'google-ai-studio/gemini-2.5-flash',
        creativityBias: 0.7,
        enableAnimations: true,
        enableGlow: true,
      },
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
    }),
    { name: 'vox0-ki-settings' }
  )
);