'use client';
import { useState } from 'react';

// 定义图表配置类型
interface ChartConfig {
  type: string;
  color: string;
}

interface ChartConfiguratorProps {
  title: string;
  chartType: 'line' | 'dynamic-line' | 'bar' | 'histogram' | 'boxplot' | 'scatter-matrix' | 'pie';
  onConfigChange: (config: ChartConfig) => void;
  className?: string;  // 已正确添加可选类型定义
}

// 设置默认回调函数同时保持接口的必需属性
export default function ChartConfigurator({
  title,
  chartType: initialChartType,
  onConfigChange,
  className
}: ChartConfiguratorProps) {
  const [chartType, setChartType] = useState<ChartConfiguratorProps['chartType']>(initialChartType);
  const [color, setColor] = useState('#3b82f6');

  const handleApply = () => {
    onConfigChange({
      type: chartType,
      color,
    });
  };

  return (
    <div className={`space-y-4 p-4 bg-gray-50 rounded-lg ${className || ''}`}>
      <div>
        <label className="block text-sm font-medium mb-1">图表类型</label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as ChartConfiguratorProps['chartType'])}
          className="w-full p-2 border rounded"
        >
          <option value="line">折线图</option>
          <option value="dynamic-line">动态折线图</option>
          <option value="bar">柱状图</option>
          <option value="histogram">直方图</option>
          <option value="boxplot">箱线图</option>
          <option value="scatter-matrix">散点图矩阵</option>
          <option value="pie">饼图</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">主题颜色</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10"
        />
      </div>

      <button
        onClick={handleApply}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        应用配置
      </button>
    </div>
  );
}