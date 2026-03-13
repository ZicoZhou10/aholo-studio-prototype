export const apiStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: '运行中', bg: 'bg-green-50', text: 'text-green-700' },
  beta: { label: '测试中', bg: 'bg-amber-50', text: 'text-amber-700' },
  deprecated: { label: '已弃用', bg: 'bg-gray-100', text: 'text-gray-500' },
  maintenance: { label: '维护中', bg: 'bg-red-50', text: 'text-red-700' },
};

export const projectStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: '草稿', bg: 'bg-gray-100', text: 'text-gray-600' },
  published: { label: '已发布', bg: 'bg-green-50', text: 'text-green-700' },
  archived: { label: '已归档', bg: 'bg-gray-100', text: 'text-gray-500' },
};

export const deploymentStatusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  uploading: { label: '上传中', bg: 'bg-blue-50', text: 'text-blue-700', icon: 'Upload' },
  building: { label: '构建中', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'Hammer' },
  testing: { label: '测试中', bg: 'bg-purple-50', text: 'text-purple-700', icon: 'TestTube' },
  deploying: { label: '部署中', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'Rocket' },
  live: { label: '运行中', bg: 'bg-green-50', text: 'text-green-700', icon: 'CheckCircle' },
  failed: { label: '失败', bg: 'bg-red-50', text: 'text-red-700', icon: 'XCircle' },
};

export function getApiStatus(status: string) {
  return apiStatusConfig[status] || apiStatusConfig.active;
}

export function getProjectStatus(status: string) {
  return projectStatusConfig[status] || projectStatusConfig.draft;
}

export function getDeploymentStatus(status: string) {
  return deploymentStatusConfig[status] || deploymentStatusConfig.uploading;
}
