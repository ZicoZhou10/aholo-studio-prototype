// ============================================================
// Aholo Studio - Shared Type Definitions
// ============================================================

// --- Enums & Literals ---

export type ApiCategory =
  | '3D生成'
  | '空间智能'
  | '渲染'
  | 'AI/LLM'
  | '资产管理'
  | '图像编辑'
  | '视频生成';

export type ApiStatus = 'active' | 'beta' | 'deprecated' | 'coming_soon';
export type ApiAuthMethod = 'api_key' | 'oauth2' | 'token';
export type ApiSource = 'aholo_core' | 'partner' | 'community' | 'researcher';

export type WorkflowStatus = 'draft' | 'published' | 'archived';
export type NodeType =
  | 'api_call'
  | 'condition'
  | 'loop'
  | 'transform'
  | 'input'
  | 'output'
  | 'human_review';

export type TemplateCategory =
  | '电商展示'
  | '数字孪生'
  | '游戏资产'
  | '建筑可视化'
  | '教育培训'
  | '营销互动';
export type TemplateStatus = 'published' | 'draft' | 'under_review';

export type AgentStatus = 'active' | 'paused' | 'configuring';
export type AgentModelProvider = 'claude' | 'lingbot' | 'vlm' | 'custom';

export type UserRole = 'admin' | 'developer' | 'business' | 'viewer';
export type TenantPlan = 'free' | 'pro' | 'enterprise';

// --- API ---

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
}

export interface ApiPricing {
  tokenCostPerCall: number;
  unit: string;
  freeQuotaPerMonth: number;
}

export interface Api {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  category: ApiCategory;
  status: ApiStatus;
  source: ApiSource;
  version: string;
  authMethod: ApiAuthMethod;
  baseUrl: string;
  endpoints: ApiEndpoint[];
  pricing: ApiPricing;
  avgLatencyMs: number;
  monthlyCallCount: number;
  rating: number;
  tags: string[];
  iconUrl: string;
  documentationUrl: string;
  createdAt: string;
  updatedAt: string;
}

// --- Workflow ---

export interface Position {
  x: number;
  y: number;
}

export interface NodePort {
  id: string;
  name: string;
  type: string; // e.g. 'image', 'mesh', 'text', 'json', 'any'
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  apiId?: string;
  position: Position;
  inputs: NodePort[];
  outputs: NodePort[];
  config: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  tags: string[];
  authorId: string;
  estimatedTokenCost: number;
  runCount: number;
  avgDurationMs: number;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

// --- Template ---

export interface TemplateComponent {
  id: string;
  type: string; // e.g. 'viewer_3d', 'carousel', 'form', 'chat_widget', 'button'
  label: string;
  props: Record<string, unknown>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  status: TemplateStatus;
  previewUrl: string;
  thumbnailUrl: string;
  components: TemplateComponent[];
  requiredApis: string[];
  tags: string[];
  authorId: string;
  authorName: string;
  downloadCount: number;
  rating: number;
  price: number; // 0 = free, else token cost
  createdAt: string;
  updatedAt: string;
}

// --- Agent ---

export interface AgentTool {
  apiId: string;
  apiName: string;
  permissions: string[];
}

export interface AgentGuardrail {
  type: 'token_limit' | 'rate_limit' | 'content_filter' | 'approval_required';
  value: string | number;
  description: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  modelProvider: AgentModelProvider;
  modelId: string;
  systemPrompt: string;
  tools: AgentTool[];
  guardrails: AgentGuardrail[];
  memoryEnabled: boolean;
  maxTokensPerRun: number;
  totalRuns: number;
  successRate: number;
  avgTokensPerRun: number;
  tags: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// --- User & Tenant ---

export interface TokenBalance {
  total: number;
  used: number;
  remaining: number;
  resetDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  tenantId: string;
  lastLoginAt: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: TenantPlan;
  tokenBalance: TokenBalance;
  memberCount: number;
  apiKeyCount: number;
  createdAt: string;
}

// --- Dashboard Stats ---

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface ApiUsageStat {
  apiId: string;
  apiName: string;
  callCount: number;
  tokenCost: number;
  avgLatencyMs: number;
  errorRate: number;
}

export interface DashboardStats {
  totalApiCalls: number;
  totalApiCallsTrend: number; // percentage change
  activeWorkflows: number;
  activeWorkflowsTrend: number;
  publishedApps: number;
  publishedAppsTrend: number;
  activeAgents: number;
  activeAgentsTrend: number;
  tokenUsed: number;
  tokenRemaining: number;
  apiCallsTimeSeries: TimeSeriesPoint[];
  tokenUsageTimeSeries: TimeSeriesPoint[];
  topApis: ApiUsageStat[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'api_call' | 'workflow_run' | 'app_publish' | 'agent_run' | 'deploy';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

// ===== V2 New Types =====

export type ProjectType = 'app' | 'workflow' | 'agent' | 'capability';
export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  thumbnailGradient: string; // CSS gradient for placeholder thumbnails
  workflowId?: string;
  agentId?: string;
  templateId?: string;
  usedApis: string[];
  status: ProjectStatus;
  authorId: string;
  isPublic: boolean;
  remixCount: number;
  viewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type DeploymentStatus = 'uploading' | 'building' | 'testing' | 'deploying' | 'live' | 'failed';

export interface PydanticField {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: unknown;
}

export interface CapabilityDraft {
  id: string;
  functionName: string;
  displayName: string;
  description: string;
  category: ApiCategory;
  codeContent: string;
  inputSchema: PydanticField[];
  outputSchema: PydanticField[];
  pricing: ApiPricing;
  deploymentStatus: DeploymentStatus;
  deploymentLogs: string[];
  createdAt: string;
}

export type ChatMessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: string;
  codeSnippet?: string;
  capabilities?: string[]; // API IDs referenced
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}
