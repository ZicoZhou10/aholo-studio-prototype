import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface AppState {
  sidebarCollapsed: boolean;
  currentUser: {
    name: string;
    role: string;
    tokenBalance: number;
    avatar?: string;
  };
  notifications: Notification[];
  recentProjectIds: string[];

  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  addRecentProject: (projectId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  currentUser: {
    name: '张明',
    role: 'admin',
    tokenBalance: 715400,
    avatar: undefined,
  },
  notifications: [],
  recentProjectIds: ['proj-ecommerce-3d', 'proj-virtual-showroom', 'proj-game-assets'],

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      { ...notification, id: `notif-${Date.now()}`, timestamp: new Date().toISOString() }
    ]
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  addRecentProject: (projectId) => set((state) => ({
    recentProjectIds: [projectId, ...state.recentProjectIds.filter(id => id !== projectId)].slice(0, 10)
  })),
}));
