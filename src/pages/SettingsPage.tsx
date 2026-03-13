import { useState } from 'react';
import { User, CreditCard, Key, Shield, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { useAppStore } from '../stores/appStore';
import { formatNumber } from '../utils/formatters';

type TabId = 'profile' | 'billing' | 'apikeys';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof User;
}

const tabs: Tab[] = [
  { id: 'profile', label: '个人信息', icon: User },
  { id: 'billing', label: '用量与计费', icon: CreditCard },
  { id: 'apikeys', label: 'API 密钥', icon: Key },
];

interface ApiKey {
  name: string;
  maskedValue: string;
  fullValue: string;
}

const mockApiKeys: ApiKey[] = [
  { name: '生产环境', maskedValue: 'ak-prod-****', fullValue: 'ak-prod-a1b2c3d4e5f6' },
  { name: '测试环境', maskedValue: 'ak-test-****', fullValue: 'ak-test-x7y8z9w0v1u2' },
  { name: '研究环境', maskedValue: 'ak-research-****', fullValue: 'ak-research-m3n4o5p6q7r8' },
];

const TOTAL_TOKENS = 1_000_000;
const USED_TOKENS = 284_600;
const REMAINING_TOKENS = TOTAL_TOKENS - USED_TOKENS;
const USAGE_PERCENT = Math.round((USED_TOKENS / TOTAL_TOKENS) * 100);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<number | null>(null);

  const toggleKeyVisibility = (index: number) => {
    setVisibleKeys((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const copyKey = (index: number, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(index);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-full px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text">设置</h1>
        <p className="text-text-secondary text-sm mt-1">管理你的账户和偏好</p>
      </div>

      {/* Tab Layout */}
      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-surface-light hover:text-text'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'apikeys' && (
            <ApiKeysTab
              visibleKeys={visibleKeys}
              copiedKey={copiedKey}
              onToggleVisibility={toggleKeyVisibility}
              onCopy={copyKey}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="bg-surface rounded-xl border border-border-light p-6">
      <h2 className="text-lg font-medium text-text mb-6">个人信息</h2>

      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-2xl font-semibold">张</span>
        </div>

        {/* Fields */}
        <div className="space-y-4 flex-1">
          <div>
            <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
              姓名
            </label>
            <p className="text-sm text-text mt-0.5">张明</p>
          </div>
          <div>
            <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
              邮箱
            </label>
            <p className="text-sm text-text mt-0.5">zhangming@aholo.ai</p>
          </div>
          <div>
            <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
              角色
            </label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield size={14} className="text-primary" />
              <p className="text-sm text-text">admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-surface rounded-xl border border-border-light p-6">
        <h2 className="text-lg font-medium text-text mb-2">用量与计费</h2>
        <p className="text-sm text-text-secondary">
          当前方案：<span className="font-medium text-text">Enterprise</span>
        </p>
      </div>

      {/* Token Balance Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={CreditCard}
          label="总额度"
          value={`${formatNumber(TOTAL_TOKENS)} 核豆`}
        />
        <StatCard
          icon={CreditCard}
          label="已使用"
          value={`${formatNumber(USED_TOKENS)} 核豆`}
        />
        <StatCard
          icon={CreditCard}
          label="剩余"
          value={`${formatNumber(REMAINING_TOKENS)} 核豆`}
        />
      </div>

      {/* Usage Progress Bar */}
      <div className="bg-surface rounded-xl border border-border-light p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">用量进度</span>
          <span className="text-sm font-medium text-text">{USAGE_PERCENT}%</span>
        </div>
        <div className="w-full h-2.5 bg-border-light rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${USAGE_PERCENT}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface ApiKeysTabProps {
  visibleKeys: Record<number, boolean>;
  copiedKey: number | null;
  onToggleVisibility: (index: number) => void;
  onCopy: (index: number, value: string) => void;
}

function ApiKeysTab({ visibleKeys, copiedKey, onToggleVisibility, onCopy }: ApiKeysTabProps) {
  return (
    <div className="bg-surface rounded-xl border border-border-light p-6">
      <h2 className="text-lg font-medium text-text mb-6">API 密钥</h2>

      <div className="space-y-4">
        {mockApiKeys.map((key, index) => (
          <div
            key={key.name}
            className="flex items-center justify-between p-4 rounded-lg border border-border-light bg-background"
          >
            <div>
              <p className="text-sm font-medium text-text">{key.name}</p>
              <p className="text-sm text-text-secondary font-mono mt-0.5">
                {visibleKeys[index] ? key.fullValue : key.maskedValue}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleVisibility(index)}
                className="p-1.5 rounded-md hover:bg-surface-light text-text-secondary hover:text-text transition-colors"
                title={visibleKeys[index] ? '隐藏' : '显示'}
              >
                {visibleKeys[index] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                type="button"
                onClick={() => onCopy(index, key.fullValue)}
                className="p-1.5 rounded-md hover:bg-surface-light text-text-secondary hover:text-text transition-colors"
                title="复制"
              >
                {copiedKey === index ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
