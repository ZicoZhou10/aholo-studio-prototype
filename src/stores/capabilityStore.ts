import { create } from 'zustand';
import { apis } from '../data/apis';
import type { Api, ApiCategory, CapabilityDraft } from '../types';

interface CapabilityFilter {
  category: ApiCategory | '';
  source: string;
  search: string;
}

interface CapabilityState {
  capabilities: Api[];
  selectedCapability: Api | null;
  filter: CapabilityFilter;
  deploymentDrafts: CapabilityDraft[];

  setFilter: (filter: Partial<CapabilityFilter>) => void;
  setSelectedCapability: (api: Api | null) => void;
  getFilteredCapabilities: () => Api[];
  addDeploymentDraft: (draft: CapabilityDraft) => void;
  updateDraftStatus: (draftId: string, status: CapabilityDraft['deploymentStatus']) => void;
}

export const useCapabilityStore = create<CapabilityState>((set, get) => ({
  capabilities: apis,
  selectedCapability: null,
  filter: { category: '', source: '', search: '' },
  deploymentDrafts: [],

  setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),
  setSelectedCapability: (api) => set({ selectedCapability: api }),

  getFilteredCapabilities: () => {
    const { capabilities, filter } = get();
    return capabilities.filter(api => {
      if (filter.category && api.category !== filter.category) return false;
      if (filter.source && api.source !== filter.source) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        return api.name.toLowerCase().includes(q)
          || api.description.toLowerCase().includes(q)
          || api.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
  },

  addDeploymentDraft: (draft) => set((state) => ({
    deploymentDrafts: [...state.deploymentDrafts, draft]
  })),

  updateDraftStatus: (draftId, status) => set((state) => ({
    deploymentDrafts: state.deploymentDrafts.map(d =>
      d.id === draftId ? { ...d, deploymentStatus: status } : d
    )
  })),
}));
