import type { CapabilityDraft } from '../types';

export const capabilityDrafts: CapabilityDraft[] = [
  {
    id: 'cap-point-cloud-seg',
    functionName: 'point_cloud_segmentation',
    displayName: '点云语义分割',
    description: '基于深度学习的3D点云语义分割算法，支持室内/室外场景中物体级和语义级分割。输入PLY/LAS格式点云，输出带语义标签的分割结果。',
    category: '3D生成',
    codeContent: `import numpy as np
from pydantic import BaseModel, Field
from typing import Optional


class PointCloudInput(BaseModel):
    """点云分割输入参数"""
    point_cloud_url: str = Field(..., description="点云文件URL，支持PLY/LAS格式")
    model_variant: str = Field(default="indoor_v3", description="模型变体: indoor_v3, outdoor_v2, general")
    num_classes: int = Field(default=40, description="分割类别数量")
    min_confidence: float = Field(default=0.6, description="最小置信度阈值")
    voxel_size: Optional[float] = Field(default=0.02, description="体素降采样尺寸，None则不降采样")
    output_format: str = Field(default="ply", description="输出格式: ply, las, npz")


class SegmentationResult(BaseModel):
    """分割结果"""
    segmented_cloud_url: str = Field(..., description="分割后点云文件URL")
    num_points: int = Field(..., description="处理的点数量")
    num_segments: int = Field(..., description="检测到的分割区域数")
    class_distribution: dict = Field(..., description="各类别点数分布")
    processing_time_ms: float = Field(..., description="处理耗时（毫秒）")
    confidence_stats: dict = Field(..., description="置信度统计: mean, min, max")


def point_cloud_segmentation(input: PointCloudInput) -> SegmentationResult:
    """
    对输入点云执行语义分割，返回带标签的分割结果。

    使用 PointTransformer V3 架构，支持大规模点云实时处理。
    """
    # Load point cloud
    pcd = load_point_cloud(input.point_cloud_url)

    # Optional voxel downsampling
    if input.voxel_size is not None:
        pcd = voxel_downsample(pcd, input.voxel_size)

    # Run segmentation model
    model = load_model(input.model_variant, input.num_classes)
    labels, confidences = model.predict(pcd)

    # Filter by confidence
    mask = confidences >= input.min_confidence
    labels[~mask] = -1  # unlabeled

    # Export result
    result_url = export_segmented_cloud(pcd, labels, input.output_format)

    return SegmentationResult(
        segmented_cloud_url=result_url,
        num_points=len(pcd),
        num_segments=len(np.unique(labels[labels >= 0])),
        class_distribution=compute_distribution(labels),
        processing_time_ms=elapsed_ms,
        confidence_stats={
            "mean": float(confidences.mean()),
            "min": float(confidences.min()),
            "max": float(confidences.max()),
        },
    )`,
    inputSchema: [
      { name: 'point_cloud_url', type: 'string', description: '点云文件URL，支持PLY/LAS格式', required: true },
      { name: 'model_variant', type: 'string', description: '模型变体: indoor_v3, outdoor_v2, general', required: false, default: 'indoor_v3' },
      { name: 'num_classes', type: 'integer', description: '分割类别数量', required: false, default: 40 },
      { name: 'min_confidence', type: 'float', description: '最小置信度阈值', required: false, default: 0.6 },
      { name: 'voxel_size', type: 'float', description: '体素降采样尺寸', required: false, default: 0.02 },
      { name: 'output_format', type: 'string', description: '输出格式: ply, las, npz', required: false, default: 'ply' },
    ],
    outputSchema: [
      { name: 'segmented_cloud_url', type: 'string', description: '分割后点云文件URL', required: true },
      { name: 'num_points', type: 'integer', description: '处理的点数量', required: true },
      { name: 'num_segments', type: 'integer', description: '检测到的分割区域数', required: true },
      { name: 'class_distribution', type: 'object', description: '各类别点数分布', required: true },
      { name: 'processing_time_ms', type: 'float', description: '处理耗时（毫秒）', required: true },
      { name: 'confidence_stats', type: 'object', description: '置信度统计', required: true },
    ],
    pricing: { tokenCostPerCall: 40, unit: '核豆/次', freeQuotaPerMonth: 15 },
    deploymentStatus: 'live',
    deploymentLogs: [
      '[2026-02-10 09:12:00] 开始上传代码包 point_cloud_segmentation.zip (2.3MB)',
      '[2026-02-10 09:12:15] 上传完成，开始构建容器镜像...',
      '[2026-02-10 09:14:30] Docker 镜像构建成功: aholo-cap/pcs:v1.0.0',
      '[2026-02-10 09:14:45] 安装依赖: numpy==1.26.4, torch==2.2.0, open3d==0.18.0',
      '[2026-02-10 09:16:00] 运行单元测试: 12/12 通过',
      '[2026-02-10 09:16:30] 运行集成测试: 输入验证 ✓ | 输出格式 ✓ | 延迟检查 ✓ (avg: 3200ms)',
      '[2026-02-10 09:17:00] 部署到生产环境 (GPU: A100 x1)...',
      '[2026-02-10 09:18:30] 健康检查通过，API 端点已上线: https://api.aholo.ai/researcher/pcs/v1',
      '[2026-02-10 09:18:35] ✅ 部署完成，状态: live',
    ],
    createdAt: '2026-02-10T09:00:00Z',
  },
  {
    id: 'cap-style-transfer-3d',
    functionName: 'style_transfer_3d',
    displayName: '3D风格迁移',
    description: '将参考图片的艺术风格迁移到3D模型的纹理上，支持油画、水彩、赛博朋克等风格。保持几何结构不变，仅改变视觉外观。',
    category: '3D生成',
    codeContent: `import torch
from pydantic import BaseModel, Field
from typing import Optional, List


class StyleTransferInput(BaseModel):
    """3D风格迁移输入"""
    model_url: str = Field(..., description="3D模型文件URL (GLB/OBJ)")
    style_image_url: str = Field(..., description="风格参考图片URL")
    style_strength: float = Field(default=0.75, description="风格迁移强度 0.0-1.0")
    preserve_edges: bool = Field(default=True, description="是否保持纹理边缘清晰")
    texture_resolution: int = Field(default=2048, description="输出纹理分辨率")
    views_for_transfer: int = Field(default=8, description="多视角迁移的视图数")


class StyleTransferOutput(BaseModel):
    """风格迁移结果"""
    styled_model_url: str = Field(..., description="风格迁移后的3D模型URL")
    preview_images: List[str] = Field(..., description="多角度预览图URL列表")
    style_similarity_score: float = Field(..., description="风格相似度评分 0-1")
    processing_time_ms: float = Field(..., description="处理耗时")


def style_transfer_3d(input: StyleTransferInput) -> StyleTransferOutput:
    """
    将参考图的艺术风格迁移到3D模型纹理。

    基于 Neural Style Fields 方法，支持多视角一致性风格迁移。
    """
    mesh = load_mesh(input.model_url)
    style_feat = extract_style_features(input.style_image_url)

    styled_textures = multi_view_style_transfer(
        mesh=mesh,
        style_features=style_feat,
        strength=input.style_strength,
        num_views=input.views_for_transfer,
        resolution=input.texture_resolution,
        preserve_edges=input.preserve_edges,
    )

    result_url = export_styled_mesh(mesh, styled_textures)
    previews = render_previews(result_url, num_views=4)

    return StyleTransferOutput(
        styled_model_url=result_url,
        preview_images=previews,
        style_similarity_score=compute_similarity(style_feat, styled_textures),
        processing_time_ms=elapsed_ms,
    )`,
    inputSchema: [
      { name: 'model_url', type: 'string', description: '3D模型文件URL (GLB/OBJ)', required: true },
      { name: 'style_image_url', type: 'string', description: '风格参考图片URL', required: true },
      { name: 'style_strength', type: 'float', description: '风格迁移强度 0.0-1.0', required: false, default: 0.75 },
      { name: 'preserve_edges', type: 'boolean', description: '是否保持纹理边缘清晰', required: false, default: true },
      { name: 'texture_resolution', type: 'integer', description: '输出纹理分辨率', required: false, default: 2048 },
      { name: 'views_for_transfer', type: 'integer', description: '多视角迁移的视图数', required: false, default: 8 },
    ],
    outputSchema: [
      { name: 'styled_model_url', type: 'string', description: '风格迁移后的3D模型URL', required: true },
      { name: 'preview_images', type: 'array<string>', description: '多角度预览图URL列表', required: true },
      { name: 'style_similarity_score', type: 'float', description: '风格相似度评分 0-1', required: true },
      { name: 'processing_time_ms', type: 'float', description: '处理耗时', required: true },
    ],
    pricing: { tokenCostPerCall: 60, unit: '核豆/次', freeQuotaPerMonth: 10 },
    deploymentStatus: 'deploying',
    deploymentLogs: [
      '[2026-03-11 14:20:00] 开始上传代码包 style_transfer_3d.zip (5.1MB)',
      '[2026-03-11 14:20:30] 上传完成，开始构建容器镜像...',
      '[2026-03-11 14:23:15] Docker 镜像构建成功: aholo-cap/st3d:v0.8.0',
      '[2026-03-11 14:23:30] 安装依赖: torch==2.2.0, torchvision==0.17.0, trimesh==4.1.0, Pillow==10.2.0',
      '[2026-03-11 14:25:00] 运行单元测试: 8/8 通过',
      '[2026-03-11 14:25:45] 运行集成测试: 输入验证 ✓ | 输出格式 ✓ | 延迟检查 ⚠ (avg: 18500ms，超过推荐阈值)',
      '[2026-03-11 14:26:10] 部署到生产环境 (GPU: A100 x2)...',
      '[2026-03-11 14:27:30] ⏳ 正在等待实例启动和健康检查...',
    ],
    createdAt: '2026-03-11T14:15:00Z',
  },
  {
    id: 'cap-depth-estimation-v2',
    functionName: 'depth_estimation_v2',
    displayName: '深度估计 V2',
    description: '基于 Depth Anything V2 的单目深度估计算法，支持高精度室内外场景深度图生成。可用于3D重建、空间理解等下游任务。',
    category: '空间智能',
    codeContent: `import numpy as np
from pydantic import BaseModel, Field
from typing import Optional


class DepthEstimationInput(BaseModel):
    """深度估计输入"""
    image_url: str = Field(..., description="输入图片URL")
    model_size: str = Field(default="large", description="模型尺寸: small, base, large, giant")
    output_type: str = Field(default="relative", description="深度类型: relative, metric")
    max_resolution: int = Field(default=1024, description="最大处理分辨率")


class DepthEstimationOutput(BaseModel):
    """深度估计输出"""
    depth_map_url: str = Field(..., description="深度图URL (16bit PNG)")
    visualization_url: str = Field(..., description="深度可视化图URL")
    depth_range: dict = Field(..., description="深度范围: min_depth, max_depth")
    processing_time_ms: float = Field(..., description="处理耗时")


def depth_estimation_v2(input: DepthEstimationInput) -> DepthEstimationOutput:
    """
    单目深度估计，输出高精度深度图。

    基于 Depth Anything V2 架构，支持 metric depth 输出。
    """
    image = load_image(input.image_url, max_res=input.max_resolution)
    model = load_depth_model(input.model_size)
    depth = model.infer(image)

    if input.output_type == "metric":
        depth = calibrate_metric_depth(depth)

    depth_url = save_depth_map(depth)
    viz_url = visualize_depth(depth, colormap="turbo")

    return DepthEstimationOutput(
        depth_map_url=depth_url,
        visualization_url=viz_url,
        depth_range={"min_depth": float(depth.min()), "max_depth": float(depth.max())},
        processing_time_ms=elapsed_ms,
    )`,
    inputSchema: [
      { name: 'image_url', type: 'string', description: '输入图片URL', required: true },
      { name: 'model_size', type: 'string', description: '模型尺寸: small, base, large, giant', required: false, default: 'large' },
      { name: 'output_type', type: 'string', description: '深度类型: relative, metric', required: false, default: 'relative' },
      { name: 'max_resolution', type: 'integer', description: '最大处理分辨率', required: false, default: 1024 },
    ],
    outputSchema: [
      { name: 'depth_map_url', type: 'string', description: '深度图URL (16bit PNG)', required: true },
      { name: 'visualization_url', type: 'string', description: '深度可视化图URL', required: true },
      { name: 'depth_range', type: 'object', description: '深度范围', required: true },
      { name: 'processing_time_ms', type: 'float', description: '处理耗时', required: true },
    ],
    pricing: { tokenCostPerCall: 20, unit: '核豆/次', freeQuotaPerMonth: 30 },
    deploymentStatus: 'uploading',
    deploymentLogs: [
      '[2026-03-12 10:05:00] 代码包已上传，等待用户配置输入/输出 Schema...',
    ],
    createdAt: '2026-03-12T10:00:00Z',
  },
];
