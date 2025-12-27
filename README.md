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
# 安装 uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 安装依赖
cd backend
uv sync

# 初始化数据库
uv run python scripts/init_db.py

# 启动服务
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
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
### 快速启动（本地开发）

#### 1. 启动后端
```bash
cd backend

# 安装依赖（首次运行）
uv sync

# 初始化数据库（首次运行）
uv run python scripts/init_db.py

# 启动后端服务
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

后端服务将在 `http://localhost:8000` 启动，可访问 API 文档：`http://localhost:8000/docs`

#### 2. 启动前端
```bash
cd frontend

# 安装依赖（首次运行）
pnpm install

# 启动前端开发服务
pnpm dev
```

前端服务将在 `http://localhost:5173` 启动

---

### 方式一：Docker Compose（推荐生产部署）
```bash
# 首次启动
docker compose up -d --build

# 后续启动
docker compose up -d

# 停止服务
docker compose down
```

**访问地址**：
- 前端：`http://localhost:4173`
- 后端API：`http://localhost:8000`
- API文档：`http://localhost:8000/docs`

---

### 方式二：Docker 镜像部署

#### 使用 GitHub Actions 构建的镜像
```bash
# 前端
docker pull ghcr.io/xeron2000/airsight-frontend:latest
docker run -d -p 4173:4173 --name airsight-frontend ghcr.io/xeron2000/airsight-frontend:latest

# 后端
docker pull ghcr.io/xeron2000/airsight-backend:latest
docker run -d -p 8000:8000 -v ./data:/app/data --name airsight-backend ghcr.io/xeron2000/airsight-backend:latest
```

#### 本地构建镜像
```bash
# 构建前端
cd frontend
docker build -t airsight-frontend .
docker run -d -p 4173:4173 --name airsight-frontend airsight-frontend

# 构建后端
cd backend
docker build -t airsight-backend .
docker run -d -p 8000:8000 -v ./data:/app/data --name airsight-backend airsight-backend
```

### 方式二：手动部署
#### 后端
```bash
# 安装 uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 安装依赖
cd backend
uv sync

# 初始化数据库
uv run python scripts/init_db.py

# 启动服务
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
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
# 备份 SQLite 数据库
cp backend/sql_app.db backup/sql_app.db.backup

# 或者使用 Docker volume 备份
docker cp airsight-backend:/app/data ./backup
```

### 数据库迁移
```bash
# 生成新迁移
cd backend
uv run alembic revision --autogenerate -m "描述"

# 执行迁移
uv run alembic upgrade head
```

### 更新部署
```bash
# 拉取最新代码后执行
git pull
docker compose up -d --build

# 或者使用预构建的镜像
docker compose pull
docker compose up -d
```

### 清理缓存
```bash
# 清理 Docker 缓存
docker system prune -a

# 清理 pnpm 缓存
cd frontend
pnpm store prune
```

## 📝 默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |

> ⚠️ **注意**：生产环境请及时修改默认密码！

## 🔧 环境变量

### 后端环境变量
```bash
# 数据库（默认使用 SQLite）
DATABASE_URL=sqlite:///./sql_app.db

# API 密钥
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS 配置
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

### 前端环境变量
```bash
# API 地址
VITE_API_URL=http://localhost:8000
```

## 🐛 常见问题

### 后端启动失败
1. 检查端口 8000 是否被占用：`lsof -i:8000`
2. 确认数据库文件权限：`chmod 644 sql_app.db`
3. 查看日志：`uv run uvicorn app.main:app --log-level debug`

### 前端无法连接后端
1. 确认后端服务正在运行：`curl http://localhost:8000/docs`
2. 检查 `.env` 文件中的 `VITE_API_URL` 配置
3. 检查 CORS 配置

### Docker 启动失败
1. 清理旧容器：`docker compose down -v`
2. 重新构建：`docker compose build --no-cache`
3. 查看日志：`docker compose logs -f`

> ✨ 提示：所有代码块中的命令均支持 Windows/Linux/macOS 系统