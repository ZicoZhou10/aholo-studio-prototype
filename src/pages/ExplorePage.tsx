import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Coins } from 'lucide-react';
import { SearchInput } from '../components/ui/SearchInput';
import { Tabs } from '../components/ui/Tabs';
import { FilterChips } from '../components/ui/FilterChips';
import { ProjectCard } from '../components/ui/ProjectCard';
import { Badge } from '../components/ui/Badge';
import { TagList } from '../components/ui/TagList';
import { useProjectStore } from '../stores/projectStore';
import { useCapabilityStore } from '../stores/capabilityStore';
import { getCategoryColor, getSourceColor } from '../utils/category-colors';
import { formatLatency, formatNumber, formatTokenCost } from '../utils/formatters';

const tabs = [
  { id: 'projects', label: '社区项目' },
  { id: 'apis', label: 'API 能力' },
];

const projectTypeOptions = [
  { id: 'all', label: '全部' },
  { id: 'app', label: 'app' },
  { id: 'workflow', label: 'workflow' },
  { id: 'agent', label: 'agent' },
];

const categoryOptions = [
  { id: '', label: '全部' },
  { id: '3D生成', label: '3D生成' },
  { id: '空间智能', label: '空间智能' },
  { id: '渲染', label: '渲染' },
  { id: 'AI/LLM', label: 'AI/LLM' },
  { id: '资产管理', label: '资产管理' },
  { id: '图像编辑', label: '图像编辑' },
  { id: '视频生成', label: '视频生成' },
];

const sourceOptions = [
  { id: '', label: '全部' },
  { id: 'aholo_core', label: '官方' },
  { id: 'partner', label: '合作伙伴' },
  { id: 'researcher', label: '研究者' },
];

const sourceLabels: Record<string, string> = {
  aholo_core: '官方',
  partner: '合作伙伴',
  researcher: '研究者',
};

export default function ExplorePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [search, setSearch] = useState('');
  const [projectType, setProjectType] = useState('all');

  const projects = useProjectStore((s) => s.projects);
  const capabilities = useCapabilityStore((s) => s.capabilities);
  const filter = useCapabilityStore((s) => s.filter);
  const setFilter = useCapabilityStore((s) => s.setFilter);

  // --- Community Projects ---
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (!p.isPublic || p.status !== 'published') return false;
      if (projectType !== 'all' && p.type !== projectType) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [projects, projectType, search]);

  // --- API Capabilities ---
  const filteredApis = useMemo(() => {
    return capabilities.filter((api) => {
      if (filter.category && api.category !== filter.category) return false;
      if (filter.source && api.source !== filter.source) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        return api.name.toLowerCase().includes(q) || api.description.toLowerCase().includes(q) || api.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [capabilities, filter]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">探索</h1>
        <p className="text-text-secondary mt-1">发现社区项目和 API 能力</p>
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            if (activeTab === 'apis') {
              setFilter({ search: value });
            }
          }}
          placeholder="搜索项目或 API..."
          className="mt-4 max-w-md"
        />
      </div>

      {/* Tab Navigation */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => {
          setActiveTab(id);
          // Sync search to capability store when switching to apis tab
          if (id === 'apis') {
            setFilter({ search });
          }
        }}
        className="mb-6"
      />

      {/* Community Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          <FilterChips
            options={projectTypeOptions}
            value={projectType}
            onChange={setProjectType}
            className="mb-6"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/build/${project.id}`)}
              />
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              没有找到匹配的项目
            </div>
          )}
        </div>
      )}

      {/* API Capabilities Tab */}
      {activeTab === 'apis' && (
        <div>
          <div className="space-y-3 mb-6">
            <FilterChips
              options={categoryOptions}
              value={filter.category}
              onChange={(id) => setFilter({ category: id as any })}
            />
            <FilterChips
              options={sourceOptions}
              value={filter.source}
              onChange={(id) => setFilter({ source: id })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApis.map((api) => {
              const catColor = getCategoryColor(api.category);
              const srcColor = getSourceColor(api.source);
              return (
                <div
                  key={api.id}
                  className="bg-surface border border-border-light rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      label={api.category}
                      variant="custom"
                      size="sm"
                      className={`${catColor.bg} ${catColor.text}`}
                    />
                    <Badge
                      label={sourceLabels[api.source] || api.source}
                      variant="custom"
                      size="sm"
                      className={`${srcColor.bg} ${srcColor.text}`}
                    />
                  </div>
                  <h3 className="font-medium text-text truncate">
                    {api.name}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2 mt-1">
                    {api.description}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Star size={12} />
                      {api.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatLatency(api.avgLatencyMs)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins size={12} />
                      {formatTokenCost(api.pricing.tokenCostPerCall)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <TagList tags={api.tags} maxVisible={3} />
                  </div>
                </div>
              );
            })}
          </div>
          {filteredApis.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              没有找到匹配的 API
            </div>
          )}
        </div>
      )}
    </div>
  );
}
