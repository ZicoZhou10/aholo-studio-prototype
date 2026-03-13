export const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  '3D生成': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  '空间智能': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  '渲染引擎': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  '可视化': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'AI/LLM': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  '资产管理': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  '视频生成': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export const sourceColors: Record<string, { bg: string; text: string }> = {
  'aholo_core': { bg: 'bg-primary/10', text: 'text-primary' },
  'partner': { bg: 'bg-secondary/10', text: 'text-secondary' },
  'researcher': { bg: 'bg-accent/10', text: 'text-amber-700' },
};

export function getCategoryColor(category: string) {
  return categoryColors[category] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
}

export function getSourceColor(source: string) {
  return sourceColors[source] || { bg: 'bg-gray-50', text: 'text-gray-700' };
}
