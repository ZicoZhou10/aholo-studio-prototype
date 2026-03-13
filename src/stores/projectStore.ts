import { create } from 'zustand';
import { projects as mockProjects } from '../data/projects';
import type { Project, ProjectType } from '../types';

interface ProjectFilter {
  type: ProjectType | 'all';
  status: string;
  search: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  filter: ProjectFilter;

  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setFilter: (filter: Partial<ProjectFilter>) => void;
  createProject: (name: string, description: string, type: ProjectType, usedApis?: string[]) => Project;
  getFilteredProjects: () => Project[];
  getUserProjects: (userId: string) => Project[];
  getPublicProjects: () => Project[];
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: mockProjects,
  currentProject: null,
  filter: { type: 'all', status: '', search: '' },

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),

  createProject: (name, description, type, usedApis = []) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      type,
      thumbnailGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      usedApis,
      status: 'draft',
      authorId: 'user-zhangming',
      isPublic: false,
      remixCount: 0,
      viewCount: 0,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ projects: [newProject, ...state.projects], currentProject: newProject }));
    return newProject;
  },

  getFilteredProjects: () => {
    const { projects, filter } = get();
    return projects.filter(p => {
      if (filter.type !== 'all' && p.type !== filter.type) return false;
      if (filter.status && p.status !== filter.status) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });
  },

  getUserProjects: (userId) => get().projects.filter(p => p.authorId === userId),
  getPublicProjects: () => get().projects.filter(p => p.isPublic && p.status === 'published'),
}));
