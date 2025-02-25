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