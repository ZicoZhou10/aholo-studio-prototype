import type { User, Tenant } from '../types';

// --- Current logged-in user ---
export const currentUser: User = {
  id: 'user-zhangmin',
  name: '张敏',
  email: 'zhangmin@aholo.ai',
  avatar: '/avatars/zhangmin.png',
  role: 'admin',
  tenantId: 'tenant-aholo-internal',
  lastLoginAt: '2026-03-11T08:30:00Z',
  createdAt: '2025-01-15T00:00:00Z',
};

// --- All team members ---
export const users: User[] = [
  currentUser,
  {
    id: 'user-liwei',
    name: '李伟',
    email: 'liwei@aholo.ai',
    avatar: '/avatars/liwei.png',
    role: 'developer',
    tenantId: 'tenant-aholo-internal',
    lastLoginAt: '2026-03-11T09:15:00Z',
    createdAt: '2025-02-10T00:00:00Z',
  },
  {
    id: 'user-chenkai',
    name: '陈凯',
    email: 'chenkai@aholo.ai',
    avatar: '/avatars/chenkai.png',
    role: 'developer',
    tenantId: 'tenant-aholo-internal',
    lastLoginAt: '2026-03-10T17:45:00Z',
    createdAt: '2025-03-05T00:00:00Z',
  },
  {
    id: 'user-wangfang',
    name: '王芳',
    email: 'wangfang@aholo.ai',
    avatar: '/avatars/wangfang.png',
    role: 'business',
    tenantId: 'tenant-aholo-internal',
    lastLoginAt: '2026-03-11T07:00:00Z',
    createdAt: '2025-04-20T00:00:00Z',
  },
  {
    id: 'user-ext-gamedev',
    name: '赵磊',
    email: 'zhaolei@stargame.com',
    avatar: '/avatars/zhaolei.png',
    role: 'developer',
    tenantId: 'tenant-stargame',
    lastLoginAt: '2026-03-10T22:30:00Z',
    createdAt: '2025-09-01T00:00:00Z',
  },
];

// --- Tenants ---
export const currentTenant: Tenant = {
  id: 'tenant-aholo-internal',
  name: 'Aholo 内部团队',
  plan: 'enterprise',
  tokenBalance: {
    total: 1_000_000,
    used: 284_600,
    remaining: 715_400,
    resetDate: '2026-04-01T00:00:00Z',
  },
  memberCount: 4,
  apiKeyCount: 8,
  createdAt: '2025-01-01T00:00:00Z',
};

export const tenants: Tenant[] = [
  currentTenant,
  {
    id: 'tenant-stargame',
    name: 'StarGame 星际游戏',
    plan: 'pro',
    tokenBalance: {
      total: 200_000,
      used: 142_300,
      remaining: 57_700,
      resetDate: '2026-04-01T00:00:00Z',
    },
    memberCount: 12,
    apiKeyCount: 5,
    createdAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'tenant-archvision',
    name: '筑景建筑设计',
    plan: 'pro',
    tokenBalance: {
      total: 150_000,
      used: 98_200,
      remaining: 51_800,
      resetDate: '2026-04-01T00:00:00Z',
    },
    memberCount: 6,
    apiKeyCount: 3,
    createdAt: '2025-10-15T00:00:00Z',
  },
  {
    id: 'tenant-freetrial',
    name: '体验用户',
    plan: 'free',
    tokenBalance: {
      total: 5_000,
      used: 3_200,
      remaining: 1_800,
      resetDate: '2026-04-01T00:00:00Z',
    },
    memberCount: 1,
    apiKeyCount: 1,
    createdAt: '2026-03-01T00:00:00Z',
  },
];
