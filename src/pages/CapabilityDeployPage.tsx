import { useState } from 'react';
import {
  Upload,
  ChevronDown,
  ChevronUp,
  Terminal,
  Code,
  ArrowRight,
  CheckCircle,
  Rocket,
  TestTube,
  Hammer,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { capabilityDrafts } from '../data/capability-drafts';
import { getDeploymentStatus } from '../utils/status-config';

const pipelineSteps = [
  { key: 'uploading', label: '上传', icon: Upload },
  { key: 'building', label: '构建', icon: Hammer },
  { key: 'testing', label: '测试', icon: TestTube },
  { key: 'deploying', label: '部署', icon: Rocket },
  { key: 'live', label: '上线', icon: CheckCircle },
];

const pipelineColors: Record<string, string> = {
  uploading: 'bg-blue-500 text-white',
  building: 'bg-amber-500 text-white',
  testing: 'bg-purple-500 text-white',
  deploying: 'bg-indigo-500 text-white',
  live: 'bg-green-500 text-white',
};

const pipelineInactive = 'bg-gray-200 text-gray-400';

function getLogLineColor(line: string): string {
  if (line.includes('✅') || line.includes('通过') || line.includes('成功') || line.includes('上线'))
    return 'text-green-400';
  if (line.includes('⚠') || line.includes('警告') || line.includes('超过'))
    return 'text-yellow-400';
  if (line.includes('⏳') || line.includes('等待') || line.includes('正在'))
    return 'text-blue-400';
  return 'text-gray-300';
}

export default function CapabilityDeployPage() {
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [expandedCode, setExpandedCode] = useState<Record<string, boolean>>({});

  const toggleLogs = (id: string) => {
    setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCode = (id: string) => {
    setExpandedCode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-full bg-surface-light">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-text">部署能力</h1>
            <p className="text-text-secondary mt-1">
              上传你的算法，快速部署为 API 原子能力
            </p>
          </div>
          <Button variant="primary" icon={Upload}>
            新建能力
          </Button>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="px-6 pb-8 max-w-5xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            {pipelineSteps.map((step, index) => {
              const StepIcon = step.icon;
              const colorClass = pipelineColors[step.key] || pipelineInactive;
              return (
                <div key={step.key} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
                    >
                      <StepIcon size={18} />
                    </div>
                    <span className="text-xs font-medium text-text-secondary">
                      {step.label}
                    </span>
                  </div>
                  {index < pipelineSteps.length - 1 && (
                    <div className="flex items-center mx-3 -mt-5">
                      <div className="w-12 h-px bg-border-light" />
                      <ArrowRight size={14} className="text-text-secondary -ml-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Capability Drafts List */}
      <div className="px-6 pb-12 max-w-5xl mx-auto space-y-4">
        {capabilityDrafts.map((draft) => {
          const status = getDeploymentStatus(draft.deploymentStatus);
          const logsOpen = expandedLogs[draft.id] || false;
          const codeOpen = expandedCode[draft.id] || false;

          return (
            <Card key={draft.id} className="p-6">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-text">
                    {draft.displayName}
                  </h3>
                  <Badge
                    label={status.label}
                    variant="custom"
                    bg={undefined}
                    text={undefined}
                    className={`${status.bg} ${status.text}`}
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                {draft.description}
              </p>

              {/* Category & Pricing */}
              <div className="flex items-center gap-3 mb-4">
                <Badge label={draft.category} variant="default" />
                <span className="text-sm text-text-secondary">
                  {draft.pricing.tokenCostPerCall} {draft.pricing.unit}
                </span>
                {draft.pricing.freeQuotaPerMonth && (
                  <span className="text-xs text-text-secondary">
                    (每月免费 {draft.pricing.freeQuotaPerMonth} 次)
                  </span>
                )}
              </div>

              {/* Expandable: Deployment Logs */}
              <div className="border-t border-border-light pt-3 mb-3">
                <button
                  type="button"
                  onClick={() => toggleLogs(draft.id)}
                  className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text transition-colors"
                >
                  <Terminal size={14} />
                  查看部署日志
                  {logsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {logsOpen && (
                  <div className="mt-3 bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
                    {draft.deploymentLogs.map((log, i) => (
                      <div key={i} className={`${getLogLineColor(log)} leading-relaxed`}>
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expandable: Code */}
              <div className="border-t border-border-light pt-3 mb-4">
                <button
                  type="button"
                  onClick={() => toggleCode(draft.id)}
                  className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text transition-colors"
                >
                  <Code size={14} />
                  查看代码
                  {codeOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {codeOpen && (
                  <pre className="mt-3 bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    {draft.codeContent}
                  </pre>
                )}
              </div>

              {/* Input/Output Schema */}
              <div className="border-t border-border-light pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Input Schema */}
                  <div>
                    <h4 className="text-sm font-semibold text-text mb-3">输入参数</h4>
                    <div className="space-y-2">
                      {draft.inputSchema.map((field) => (
                        <div
                          key={field.name}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="font-semibold text-text whitespace-nowrap">
                            {field.name}
                          </span>
                          <Badge label={field.type} variant="info" size="sm" />
                          {field.required ? (
                            <Badge label="必填" variant="error" size="sm" />
                          ) : (
                            <Badge label="可选" variant="default" size="sm" />
                          )}
                          <span className="text-text-secondary text-xs mt-0.5">
                            {field.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Output Schema */}
                  <div>
                    <h4 className="text-sm font-semibold text-text mb-3">输出参数</h4>
                    <div className="space-y-2">
                      {draft.outputSchema.map((field) => (
                        <div
                          key={field.name}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="font-semibold text-text whitespace-nowrap">
                            {field.name}
                          </span>
                          <Badge label={field.type} variant="info" size="sm" />
                          {field.required ? (
                            <Badge label="必填" variant="error" size="sm" />
                          ) : (
                            <Badge label="可选" variant="default" size="sm" />
                          )}
                          <span className="text-text-secondary text-xs mt-0.5">
                            {field.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
