import type { ChatMessage } from '../types';

export const buildChatHistory: ChatMessage[] = [
  {
    id: 'msg-001',
    role: 'user',
    content: '创建一个运动鞋3D产品展示页面',
    timestamp: '2026-03-08T10:15:00Z',
  },
  {
    id: 'msg-002',
    role: 'assistant',
    content: '好的，我来为你创建一个运动鞋3D产品展示页面。已选择以下能力：\n\n- **Web Viewer SDK** — 3D模型交互查看\n- **2D-to-3D** — 从产品图生成3D模型\n- **KE Render** — 高质量渲染输出\n\n已生成基础页面组件，包含3D查看器和产品标题区域：',
    timestamp: '2026-03-08T10:15:12Z',
    capabilities: ['api-web-viewer', 'api-2dto3d', 'api-ke-render'],
    codeSnippet: `import { AholoViewer } from '@aholo/web-viewer-sdk';

export default function SneakerShowcase() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-2 gap-8 p-8">
        <div className="aspect-square rounded-2xl overflow-hidden">
          <AholoViewer
            sceneId="sneaker-air-max"
            autoRotate={true}
            enableZoom={true}
            backgroundColor="#1a1a2e"
          />
        </div>
        <div className="flex flex-col justify-center text-white">
          <h1 className="text-4xl font-bold">Air Max 270</h1>
          <p className="text-gray-400 mt-4">经典气垫跑鞋，轻盈舒适</p>
        </div>
      </div>
    </div>
  );
}`,
  },
  {
    id: 'msg-003',
    role: 'user',
    content: '添加一个颜色切换器，支持5种颜色',
    timestamp: '2026-03-08T10:18:30Z',
  },
  {
    id: 'msg-004',
    role: 'assistant',
    content: '已添加颜色切换器组件，支持5种配色方案。点击色块可实时切换3D模型材质和渲染效果：',
    timestamp: '2026-03-08T10:18:45Z',
    capabilities: ['api-web-viewer', 'api-ke-render'],
    codeSnippet: `const COLORS = [
  { name: '经典黑', hex: '#1a1a1a', materialId: 'mat-black' },
  { name: '珍珠白', hex: '#f0e6d3', materialId: 'mat-white' },
  { name: '森林绿', hex: '#2d5a27', materialId: 'mat-green' },
  { name: '海军蓝', hex: '#1e3a5f', materialId: 'mat-blue' },
  { name: '樱花粉', hex: '#f4a0b5', materialId: 'mat-pink' },
];

function ColorSwitcher({ onSelect, activeColor }) {
  return (
    <div className="flex gap-3 mt-6">
      {COLORS.map((color) => (
        <button
          key={color.hex}
          onClick={() => onSelect(color)}
          className={\`w-10 h-10 rounded-full border-2 transition-all \${
            activeColor === color.hex ? 'border-white scale-110' : 'border-transparent'
          }\`}
          style={{ backgroundColor: color.hex }}
          title={color.name}
        />
      ))}
    </div>
  );
}`,
  },
  {
    id: 'msg-005',
    role: 'user',
    content: '把背景改成渐变色，从深蓝到黑',
    timestamp: '2026-03-08T10:22:00Z',
  },
  {
    id: 'msg-006',
    role: 'assistant',
    content: '已更新背景样式，使用从深蓝到黑色的径向渐变，营造高端产品展示氛围：',
    timestamp: '2026-03-08T10:22:08Z',
    codeSnippet: `// 更新主容器样式
<div
  className="min-h-screen flex items-center justify-center"
  style={{
    background: 'radial-gradient(ellipse at top, #0f1b3d 0%, #0a0a0a 70%)',
  }}
>
  {/* Viewer 背景同步更新 */}
  <AholoViewer
    sceneId="sneaker-air-max"
    autoRotate={true}
    enableZoom={true}
    backgroundColor="transparent"
    environmentMap="studio_dark"
  />
</div>`,
  },
  {
    id: 'msg-007',
    role: 'system',
    content: '工作流已自动更新：新增 KE Render 节点用于颜色变体渲染。工作流 "电商商品 3D 展示生成" 已保存新版本 v2.1。',
    timestamp: '2026-03-08T10:22:15Z',
    capabilities: ['api-ke-render'],
  },
  {
    id: 'msg-008',
    role: 'user',
    content: '添加产品信息面板，显示名称、价格、描述',
    timestamp: '2026-03-08T10:25:00Z',
  },
  {
    id: 'msg-009',
    role: 'assistant',
    content: '已添加产品信息面板组件，包含名称、价格、描述和购买按钮。使用毛玻璃效果与深色背景融合：',
    timestamp: '2026-03-08T10:25:15Z',
    codeSnippet: `function ProductInfoPanel({ product }) {
  return (
    <div className="backdrop-blur-md bg-white/5 rounded-2xl p-8 border border-white/10">
      <span className="text-sm text-blue-400 font-medium tracking-wider uppercase">
        {product.brand}
      </span>
      <h1 className="text-4xl font-bold text-white mt-2">
        {product.name}
      </h1>
      <p className="text-gray-400 mt-4 leading-relaxed">
        {product.description}
      </p>
      <div className="flex items-baseline gap-3 mt-6">
        <span className="text-3xl font-bold text-white">
          ¥{product.price}
        </span>
        {product.originalPrice && (
          <span className="text-lg text-gray-500 line-through">
            ¥{product.originalPrice}
          </span>
        )}
      </div>
      <button className="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-lg transition-colors">
        立即购买
      </button>
    </div>
  );
}`,
  },
  {
    id: 'msg-010',
    role: 'system',
    content: '应用已准备好发布。所有组件渲染正常，API调用测试通过。预览地址：preview.aholo.com/sneaker-showcase',
    timestamp: '2026-03-08T10:25:30Z',
    capabilities: ['api-web-viewer', 'api-2dto3d', 'api-ke-render'],
  },
];
