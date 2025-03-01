# 前端开发规范

## 一、Tailwind主题配置
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#4f46e5',
      }
    }
  },
  plugins: [require("daisyui")]
}

// daisyui配置
daisyui: {
  themes: ["light", "dark"],
  styled: true,
  base: true,
  utils: true,
}
```

## 二、DaisyUI组件使用规则
1. **布局组件**：
   - 使用`Card`组件构建数据看板
   - `Tabs`组件切换分析视图
   - `Table`组件展示原始数据

2. **交互规范**：
   - 按钮尺寸统一为`btn-md`
   - 表单元素使用`input-bordered`样式
   - 加载状态使用`loading`修饰符

## 三、可视化集成方案
```jsx
// 图表组件示例
import { Line } from 'react-chartjs-2';

export default function TrendChart({ data }) {
  return (
    <div className="w-full h-96 p-4 bg-base-200 rounded-box">
      <Line 
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false
        }}
      />
    </div>
  )
}
```

## 四、状态管理
1. 使用Zustand进行全局状态管理
2. 实现数据缓存机制
3. 配置请求重试策略
4. 实现错误边界处理

## 五、性能优化
1. 使用React.memo优化组件渲染
2. 实现代码分割和懒加载
3. 配置图片懒加载
4. 使用Web Worker处理复杂计算

以下是各个组件对应的样式使用指南，基于你提供的全局CSS配置：

### 1. 卡片组件 (Card)
```tsx
<div className="google-card">
  <h2>数据概览</h2>
  <p>今日访问量：2,345 次</p>
</div>
```
使用要点：
- 必须添加 `google-card` 类
- 自动继承背景色、圆角、阴影等特性
- 支持hover阴影变化效果

### 2. 数据徽章 (Badge)
```tsx
<div className="data-badge">转化率 +18%</div>
```
特性说明：
- 自动带有10%主色的半透明背景
- 文字颜色与主题联动
- 适合展示关键指标

### 3. 增强按钮 (Button)
```tsx
<button className="btn-google bg-primary text-white">
  立即分析
</button>
```
可选搭配：
- 颜色类：`bg-primary` / `bg-secondary` / `bg-accent`
- 尺寸类：`px-8` / `py-3` 调整大小
- 图标组合：与`flex items-center`配合使用

### 4. 图表容器
```tsx
<div className="chart-container">
  <LineChart data={...} />
</div>
```
特性：
- 自动继承卡片样式
- 保证400px最小高度
- 建议搭配`w-full`实现响应式

### 5. 表格组件
```tsx
<div className="google-card overflow-x-auto">
  <table className="w-full viz-text">
    {/* 表格内容 */}
  </table>
</div>
```
优化要点：
- 外层使用`google-card`包装
- 添加`overflow-x-auto`实现横向滚动
- 表格文字使用`viz-text`优化可读性

### 6. 表单组件
```tsx
<div className="google-card space-y-4">
  <input type="text" placeholder="请输入关键词" />
  <select className="w-full">
    <option>选项1</option>
  </select>
</div>
```
自动获得：
- 输入框/下拉框的聚焦光环效果
- 统一的过渡动画
- 建议搭配`space-y-*`类实现间距控制

### 7. 导航链接
```tsx
<nav className="space-x-4">
  <a href="#dashboard">仪表盘</a>
  <a href="#reports">报告</a>
</nav>
```
特性：
- 自动带有颜色过渡效果
- hover状态自动变浅（`primary-focus`）
- 建议搭配`font-medium`加粗文字

### 8. 阴影动画组件
```tsx
<div className="google-card animate-google-elevation">
  可交互卡片
</div>
```
效果说明：
- 点击时触发Material Design风格阴影动画
- 与hover阴影变化叠加使用效果更佳

### 9. 打印优化
```tsx
<div className="google-card print:shadow-none">
  可打印内容
</div>
```
最佳实践：
- 为需要打印的区块添加`print:`前缀修饰
- 使用`print:hidden`隐藏不需要打印的元素

### 10. 滚动容器
```tsx
<div className="h-64 overflow-y-auto">
  {/* 长内容 */}
</div>
```
自动获得：
- 自定义滚动条样式（宽度/颜色/圆角）
- 滚动轨道与当前主题适配
- 建议搭配`overscroll-contain`优化滚动行为

### 布局组合示例
```tsx
<div className="grid md:grid-cols-2 gap-6">
  <div className="chart-container">
    <LineChart />
  </div>
  
  <div className="space-y-4">
    <div className="google-card">
      <h2>实时数据</h2>
      <div className="data-badge">当前在线：1,234</div>
    </div>
    
    <button className="btn-google bg-secondary w-full">
      刷新数据
    </button>
  </div>
</div>
```

关键设计原则：
1. 使用`google-card`作为所有卡片化内容的基础容器
2. `data-badge`用于突出显示关键指标
3. 交互元素优先使用`btn-google`样式
4. 图表必须包裹在`chart-container`中
5. 文字内容使用`viz-text`优化可读性
6. 动画效果使用`animate-google-elevation`
7. 长列表/表格必须配合滚动容器使用