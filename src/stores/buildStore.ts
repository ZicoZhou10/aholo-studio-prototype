import { create } from 'zustand';
import type { ChatMessage, GeneratedFile } from '../types';
import type { Node, Edge } from '@xyflow/react';

type BuildTab = 'preview' | 'code' | 'flow';

interface BuildState {
  activeTab: BuildTab;
  chatMessages: ChatMessage[];
  selectedCapabilities: string[]; // API IDs
  generatedFiles: GeneratedFile[];
  flowNodes: Node[];
  flowEdges: Edge[];
  isAssistantTyping: boolean;

  setActiveTab: (tab: BuildTab) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  toggleCapability: (apiId: string) => void;
  setGeneratedFiles: (files: GeneratedFile[]) => void;
  setFlowNodes: (nodes: Node[]) => void;
  setFlowEdges: (edges: Edge[]) => void;
  setIsAssistantTyping: (typing: boolean) => void;
  loadChatHistory: (messages: ChatMessage[]) => void;
  clearBuild: () => void;
}

export const useBuildStore = create<BuildState>((set, get) => ({
  activeTab: 'preview',
  chatMessages: [],
  selectedCapabilities: [],
  generatedFiles: [],
  flowNodes: [],
  flowEdges: [],
  isAssistantTyping: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  addChatMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ chatMessages: [...state.chatMessages, newMessage] }));

    // Simulate assistant response after user message
    if (message.role === 'user') {
      set({ isAssistantTyping: true });
      setTimeout(() => {
        const response: ChatMessage = {
          id: `msg-${Date.now()}-resp`,
          role: 'assistant',
          content: '收到，正在处理你的请求...',
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          chatMessages: [...state.chatMessages, response],
          isAssistantTyping: false,
        }));
      }, 1500);
    }
  },

  toggleCapability: (apiId) => set((state) => ({
    selectedCapabilities: state.selectedCapabilities.includes(apiId)
      ? state.selectedCapabilities.filter(id => id !== apiId)
      : [...state.selectedCapabilities, apiId]
  })),

  setGeneratedFiles: (files) => set({ generatedFiles: files }),
  setFlowNodes: (nodes) => set({ flowNodes: nodes }),
  setFlowEdges: (edges) => set({ flowEdges: edges }),
  setIsAssistantTyping: (typing) => set({ isAssistantTyping: typing }),
  loadChatHistory: (messages) => set({ chatMessages: messages }),
  clearBuild: () => set({
    activeTab: 'preview',
    chatMessages: [],
    selectedCapabilities: [],
    generatedFiles: [],
    flowNodes: [],
    flowEdges: [],
    isAssistantTyping: false,
  }),
}));
