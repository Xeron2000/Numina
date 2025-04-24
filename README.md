<div align="center">
  <img src="./img/logo.svg" width="100" alt="Project Logo">
</div>

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=34&pause=1000&center=true&vCenter=true&width=435&lines=AirSight" alt="Typing SVG">
</div>
<br>
<div align="center">
  <a href="https://fastapi.tiangolo.com/">
    <img src="https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI">
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React">
  </a>
  <a href="https://sqlite.org/index.html">
    <img src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white" alt="SQLite">
  </a>
</div>

## 📜 目录
1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [开发环境搭建](#开发环境搭建)
4. [项目结构](#项目结构)
5. [部署指南](#部署指南)

## 🎯 项目概述
AirSight 是一个空气污染数据分析平台，提供数据上传、分析、可视化等功能。该项目采用前后端分离架构：
- **后端**: FastAPI 框架
- **前端**: React + Vite 构建

## 🛠️ 技术栈
### 后端
![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
- FastAPI
- SQLite
- SQLAlchemy
- Alembic (数据库迁移)
- uvicorn (ASGI服务器)

### 前端
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
- TypeScript
- Vite
- TailwindCSS
- pnpm (包管理器)

## 💻 开发环境搭建
### 后端开发环境
```bash
# 创建虚拟环境
cd backend
python -m venv .venv
# Windows 激活
.venv\Scripts\activate
# Linux/Mac 激活
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 初始化数据库
python scripts/init_db.py

# 启动服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 前端开发环境
```bash
# 安装 pnpm
npm install -g pnpm

# 安装依赖
cd frontend
pnpm install

# 启动服务
pnpm dev
```


## 📂 项目结构
### 后端
```
backend/
├── alembic/              # 数据库迁移配置
├── app/
│   ├── api/              # API路由
│   ├── core/             # 核心配置
│   ├── db/               # 数据库操作
│   ├── models/           # 数据模型
│   ├── schemas/          # Pydantic模型
│   └── utils/            # 工具函数
└── scripts/              # 管理脚本
```

### 前端
```
frontend/
├── src/
│   ├── api/              # API调用
│   ├── components/       # 通用组件
│   ├── features/         # 功能模块
│   ├── hooks/            # 自定义Hooks
│   ├── routes/           # 路由配置
│   └── stores/           # 状态管理
├── public/               # 静态资源
└── vite.config.ts        # Vite配置
```


## 🚀 部署指南
### 方式一：Docker Compose（推荐）
```bash
# 首次启动
docker compose -f docker-compose.prod.yml up -d --build

# 后续启动
docker compose -f docker-compose.prod.yml up -d
```

**访问地址**：
- 前端：`http://localhost:4137`
- 后端API：`http://localhost:8000`
- API文档：`http://localhost:8000/docs`

### 方式二：手动部署
#### 后端
```bash
# 安装依赖
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# 初始化数据库
python scripts/init_db.py

# 启动服务
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### 前端
```bash
cd frontend
pnpm install
pnpm build
pnpm preview  # 启动预览服务器
```

## 🔄 维护说明
### 数据备份
```bash
# 备份数据库
copy backend\sql_app.db backup\sql_app.db.backup
```

### 更新部署
```bash
# 拉取最新代码后执行
docker compose -f docker-compose.prod.yml up -d --build
```

> ✨ 提示：所有代码块中的命令均支持 Windows/Linux/macOS 系统