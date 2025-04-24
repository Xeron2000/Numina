# AirSight 项目文档

## 目录
1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [开发环境搭建](#开发环境搭建)
4. [项目结构](#项目结构)
5. [部署指南](#部署指南)

## 项目概述
AirSight 是一个空气污染数据分析平台，提供数据上传、分析、可视化等功能。该项目采用前后端分离架构，后端使用 FastAPI 框架，前端使用 React + Vite 构建。

## 技术栈

### 后端
- Python 3.11
- FastAPI
- SQLite
- SQLAlchemy
- Alembic (数据库迁移)
- uvicorn (ASGI服务器)

### 前端
- React
- TypeScript
- Vite
- TailwindCSS
- pnpm (包管理器)

## 开发环境搭建

### 后端开发环境

1. 创建并激活 Python 虚拟环境
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
```

2. 安装依赖
```bash
pip install -r requirements.txt
```

3. 初始化数据库
```bash
python scripts/init_db.py
```

4. 启动开发服务器
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 前端开发环境

1. 安装 pnpm（如果未安装）
```bash
npm install -g pnpm
```

2. 安装依赖
```bash
cd frontend
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

## 项目结构

### 后端结构
```
backend/
├── alembic/              # 数据库迁移配置
├── app/
│   ├── api/             # API路由
│   ├── core/            # 核心配置
│   ├── db/              # 数据库相关
│   ├── models/          # 数据模型
│   ├── schemas/         # Pydantic模型
│   └── utils/           # 工具函数
├── scripts/             # 管理脚本
└── requirements.txt     # 依赖清单
```

### 前端结构
```
frontend/
├── src/
│   ├── api/            # API调用
│   ├── components/     # 通用组件
│   ├── features/       # 功能模块
│   ├── hooks/          # 自定义Hooks
│   ├── routes/         # 路由配置
│   └── stores/         # 状态管理
├── public/             # 静态资源
└── vite.config.ts      # Vite配置
```

## 部署指南

### 方式一：Docker Compose 部署（推荐）

1. 配置环境变量
```bash
cp .env.prod.example .env.prod
```

编辑 `.env.prod` 文件，设置必要的环境变量：
```plaintext
API_URL=http://localhost:8000
JWT_SECRET=your-secure-secret-key
```

2. 构建和启动服务
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

3. 访问应用
- 前端：http://localhost:80
- 后端API：http://localhost:8000
- API文档：http://localhost:8000/docs

### 方式二：手动部署

#### 后端部署

1. 安装 Python 3.11 和依赖
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. 配置环境变量
```bash
set SQLALCHEMY_DATABASE_URI=sqlite:///./sql_app.db
set JWT_SECRET=your-secure-secret-key
set ENVIRONMENT=production
```

3. 初始化数据库
```bash
python scripts/init_db.py
```

4. 启动服务
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### 前端部署

1. 安装依赖并构建
```bash
cd frontend
pnpm install
pnpm build
```

2. 使用 Nginx 部署

安装 Nginx，将构建后的文件复制到 Nginx 目录：
```bash
copy dist\* C:\nginx\html\
```

配置 Nginx：
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. 启动 Nginx
```bash
nginx
```

## 维护说明

### 日志
- 后端日志位于 `backend/logs/` 目录
- Docker 日志可通过 `docker compose -f docker-compose.prod.yml logs` 查看

### 数据备份
建议定期备份 SQLite 数据库文件：
```bash
copy backend\sql_app.db backup\sql_app.db.backup
```

### 更新部署
1. 拉取最新代码
2. 重新构建并启动服务
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

        