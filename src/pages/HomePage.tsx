import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { PromptInput } from '../components/ui/PromptInput';
import { ProjectCard } from '../components/ui/ProjectCard';
import { useProjectStore } from '../stores/projectStore';

const suggestions = [
  '电商3D产品展示',
  '虚拟展厅',
  '游戏资产管线',
  '3D营销视频',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const projects = useProjectStore((s) => s.projects);
  const userProjects = useMemo(() => projects.filter(p => p.authorId === 'user-zhangmin'), [projects]);
  const publicProjects = useMemo(() => projects.filter(p => p.isPublic && p.status === 'published'), [projects]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    navigate('/build');
  };

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 pt-20 pb-16">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={28} className="text-primary" />
          <h1 className="text-3xl font-semibold text-text tracking-tight">
            构建你的 3D 应用
          </h1>
        </div>
        <p className="text-text-secondary text-base mb-8">
          描述你想创建的应用，AI 将帮你自动生成
        </p>

        <div className="w-full max-w-2xl">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleSubmit}
            placeholder="描述你想构建的应用..."
          />
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {suggestions.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setPrompt(label);
              }}
              className="px-4 py-1.5 rounded-full text-sm border border-border-light bg-surface hover:bg-surface-light text-text-secondary hover:text-text transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      {userProjects.length > 0 && (
        <section className="px-6 pb-12 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-text">我的项目</h2>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              查看全部
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
            {userProjects.map((project) => (
              <div key={project.id} className="flex-shrink-0 w-64">
                <ProjectCard
                  project={project}
                  onClick={() => navigate(`/build/${project.id}`)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Community Highlights */}
      {publicProjects.length > 0 && (
        <section className="px-6 pb-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-medium text-text">
              <TrendingUp size={18} className="text-primary" />
              社区热门
            </h2>
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              查看更多
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/build/${project.id}`)}
                onRemix={() => navigate(`/build?remix=${project.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
