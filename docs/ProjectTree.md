# 项目文件结构说明

## 整体结构
```bash
Numina/
├── frontend/         # Next.js前端项目
│   ├── app/          # App Router路由
│   ├── components/   # 公共组件库
│   ├── lib/          # 工具函数库
│   ├── public/       # 静态资源
│   └── styles/       # 全局样式
├── backend/          # FastAPI后端项目
│   ├── app/          # 核心应用代码
│   ├── migrations/   # 数据库迁移脚本
│   └── tests/        # 接口测试用例
├── docs/             # 项目文档
├── infra/            # 基础设施配置
│   ├── docker/       # Docker容器配置
│   └── nginx/        # 反向代理配置
└── scripts/          # 开发脚本
```

## 前端详细结构
```bash
frontend/
├── app/
│   ├── (dashboard)   # 数据分析看板路由组
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── api/          # 前端API路由
│   └── globals.css   # 全局样式入口
├── components/
│   ├── charts/       # 可视化图表组件
│   ├── data-table/   # 数据表格组件
│   └── filters/      # 数据筛选组件
├── lib/
│   ├── utils.ts      # 工具函数
│   └── api-client.ts # API请求封装
```

## 后端详细结构
```bash
backend/app/
├── api/
│   └── v1/
│       ├── endpoints/ # API路由
│       │   ├── analytics.py
│       │   └── datasets.py
│       └── deps.py    # 依赖注入
├── core/
│   ├── config.py      # 配置管理
│   └── security.py    # 安全认证
├── db/
│   ├── models.py      # SQLAlchemy模型
│   └── session.py     # 数据库会话管理
├── services/
│   ├── data_service.py # 数据处理服务
│   └── cache.py       # Redis缓存管理
└── main.py            # FastAPI入口
```

## 配置文件说明
```bash
├── .env.example       # 环境变量模板
├── docker-compose.yml # 多容器编排
├── Makefile           # 常用命令快捷入口
├── pyproject.toml     # Python依赖管理
└── package.json       # 前端依赖管理