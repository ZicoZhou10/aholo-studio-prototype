import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { ArrowLeft, Sparkles, Send, Code, Eye, GitBranch, Box } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { CapabilityChip } from '../components/ui/CapabilityChip';
import { EmptyState } from '../components/ui/EmptyState';
import { useBuildStore } from '../stores/buildStore';
import { useProjectStore } from '../stores/projectStore';
import { apis } from '../data/apis';
import { buildChatHistory } from '../data/chat-history';
import { projects } from '../data/projects';
import { formatTokenCost } from '../utils/formatters';

const BUILD_TABS = [
  { id: 'preview', label: '预览', icon: Eye },
  { id: 'code', label: '代码', icon: Code },
  { id: 'flow', label: '流程图', icon: GitBranch },
];

export default function BuildPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const {
    activeTab,
    setActiveTab,
    chatMessages,
    addChatMessage,
    isAssistantTyping,
    selectedCapabilities,
    toggleCapability,
    flowNodes,
    loadChatHistory,
  } = useBuildStore();

  const { currentProject, setCurrentProject } = useProjectStore();

  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load project and chat history
  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
      loadChatHistory(buildChatHistory);
    }
  }, [projectId, setCurrentProject, loadChatHistory]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAssistantTyping]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    addChatMessage({ role: 'user', content: chatInput });
    setChatInput('');
  };

  const projectName = currentProject?.name ?? '未命名项目';

  // Get the latest code snippet from chat messages
  const latestCodeSnippet = [...chatMessages]
    .reverse()
    .find((m) => m.codeSnippet)?.codeSnippet;

  // Active APIs for capability panel
  const activeApis = apis.filter((a) => a.status === 'active');

  // Selected API objects for cost summary
  const selectedApis = apis.filter((a) => selectedCapabilities.includes(a.id));
  const totalTokenCost = selectedApis.reduce(
    (sum, a) => sum + a.pricing.tokenCostPerCall,
    0
  );

  return (
    <div className="h-screen flex flex-col bg-surface">
      {/* ===== Top Bar ===== */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-border bg-surface shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg hover:bg-surface-light transition-colors text-text-secondary hover:text-text"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="font-medium text-text text-sm">{projectName}</span>
        </div>

        {/* Center */}
        <Tabs tabs={BUILD_TABS} activeTab={activeTab} onChange={(id) => setActiveTab(id as 'preview' | 'code' | 'flow')} />

        {/* Right */}
        <Button variant="primary" size="sm">
          发布
        </Button>
      </div>

      {/* ===== 3-Panel Layout ===== */}
      <PanelGroup orientation="horizontal" className="flex-1">
        {/* ----- Left Panel: Chat / AI Copilot ----- */}
        <Panel defaultSize={30} minSize={20}>
          <div className="flex flex-col h-full bg-surface">
            {/* Chat Header */}
            <div className="h-11 flex items-center gap-2 px-4 border-b border-border shrink-0">
              <Sparkles size={16} className="text-primary" />
              <span className="font-medium text-sm text-text">AI 助手</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {chatMessages.map((msg) => {
                if (msg.role === 'system') {
                  return (
                    <div key={msg.id} className="text-center">
                      <p className="text-xs text-text-muted italic">{msg.content}</p>
                      {msg.capabilities && msg.capabilities.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1 mt-1">
                          {msg.capabilities.map((capId) => {
                            const api = apis.find((a) => a.id === capId);
                            return api ? (
                              <span
                                key={capId}
                                className="inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                              >
                                {api.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isUser = msg.role === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-primary text-white rounded-2xl rounded-br-md'
                          : 'bg-surface-light text-text rounded-2xl rounded-bl-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {msg.codeSnippet && (
                        <pre className="mt-2 p-3 bg-gray-900 text-gray-100 text-xs rounded-lg overflow-x-auto font-mono leading-relaxed">
                          {msg.codeSnippet}
                        </pre>
                      )}

                      {msg.capabilities && msg.capabilities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {msg.capabilities.map((capId) => {
                            const api = apis.find((a) => a.id === capId);
                            return api ? (
                              <span
                                key={capId}
                                className="inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-white/15 text-white/90 font-medium"
                              >
                                {api.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isAssistantTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface-light rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                    <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-border shrink-0">
              <div className="relative flex items-end gap-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="输入消息..."
                  rows={1}
                  className="flex-1 px-4 py-2.5 border border-border rounded-xl bg-surface text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && chatInput.trim()) {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />

        {/* ----- Center Panel: Preview / Code / Flow ----- */}
        <Panel defaultSize={45} minSize={30}>
          <div className="h-full bg-surface flex flex-col">
            {activeTab === 'preview' && (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
                    <Box size={40} className="text-white/60 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <p className="text-white/70 text-lg font-medium">3D 预览</p>
                  <p className="text-white/40 text-sm mt-1">运动鞋产品展示</p>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="flex-1 overflow-auto">
                {latestCodeSnippet ? (
                  <pre className="p-6 bg-gray-950 text-gray-100 text-sm font-mono leading-relaxed h-full overflow-auto">
                    {latestCodeSnippet}
                  </pre>
                ) : (
                  <EmptyState
                    icon={Code}
                    title="暂无代码"
                    description="与 AI 助手对话生成代码后，将在此处展示"
                  />
                )}
              </div>
            )}

            {activeTab === 'flow' && (
              <div className="flex-1 flex items-center justify-center bg-surface-light">
                {flowNodes.length > 0 ? (
                  <p className="text-text-muted text-sm">ReactFlow 画布</p>
                ) : (
                  /* Mock workflow diagram */
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-3 rounded-lg bg-primary/10 border border-primary/30 text-sm font-medium text-primary">
                      输入图片
                    </div>
                    <div className="w-8 h-px bg-border relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-border border-y-[4px] border-y-transparent" />
                    </div>
                    <div className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-sm font-medium text-blue-700">
                      2D 转 3D
                    </div>
                    <div className="w-8 h-px bg-border relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-border border-y-[4px] border-y-transparent" />
                    </div>
                    <div className="px-4 py-3 rounded-lg bg-purple-50 border border-purple-200 text-sm font-medium text-purple-700">
                      KE 渲染
                    </div>
                    <div className="w-8 h-px bg-border relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-border border-y-[4px] border-y-transparent" />
                    </div>
                    <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm font-medium text-green-700">
                      Web Viewer
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />

        {/* ----- Right Panel: Capabilities / Properties ----- */}
        <Panel defaultSize={25} minSize={15}>
          <div className="h-full bg-surface flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-11 flex items-center px-4 border-b border-border shrink-0">
              <span className="font-medium text-sm text-text">能力选择</span>
            </div>

            {/* Capability List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {activeApis.map((api) => (
                <CapabilityChip
                  key={api.id}
                  api={api}
                  selected={selectedCapabilities.includes(api.id)}
                  onClick={() => toggleCapability(api.id)}
                />
              ))}
            </div>

            {/* Selected Capabilities Summary */}
            {selectedApis.length > 0 && (
              <div className="border-t border-border p-4 shrink-0">
                <h4 className="text-xs font-medium text-text-secondary mb-2">
                  已选能力 ({selectedApis.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedApis.map((api) => (
                    <div
                      key={api.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-text truncate">{api.name}</span>
                      <span className="text-text-muted shrink-0 ml-2">
                        {formatTokenCost(api.pricing.tokenCostPerCall)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-border-light flex items-center justify-between text-xs font-medium">
                  <span className="text-text-secondary">总计</span>
                  <span className="text-primary">
                    {totalTokenCost} 核豆/次
                  </span>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
