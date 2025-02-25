# 项目开发与运行指南

本指南将帮助您设置并运行本项目。项目采用 Next.js + FastAPI + TailwindCSS + DaisyUI + SQLite 技术栈。

## 1. 安装依赖

### 前端依赖
1. 进入 `frontend` 目录：
   ```bash
   cd frontend
   ```
2. 安装依赖：
   ```bash
   pnpm install
   ```

### 后端依赖
1. 进入 `backend` 目录：
   ```bash
   cd ../backend
   ```
2. 创建虚拟环境（推荐）：
   ```bash
   python -m venv venv
   ```
3. 激活虚拟环境：
   - Linux/macOS:
     ```bash
     source venv/bin/activate
     ```
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
4. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

## 2. 初始化数据库

1. 确保在 `backend` 目录下。
2. SQLite 数据库文件 `sql_app.db` 已经存在，无需额外初始化步骤。
3. 如果需要重置数据库，可以删除 `sql_app.db` 文件，程序会在首次运行时自动创建新的数据库。

## 3. 配置环境变量

### 前端
1. 复制 `.env.local.example` 为 `.env.local`：
   ```bash
   cp .env.local.example .env.local
   ```
2. 根据需求修改 `.env.local` 中的配置。

### 后端
1. 复制 `.env.example` 为 `.env`：
   ```bash
   cp .env.example .env
   ```
2. 根据需求修改 `.env` 中的配置。

## 4. 启动项目

### 启动前端
1. 在 `frontend` 目录下运行：
   ```bash
   pnpm dev
   ```
2. 前端将在 `http://localhost:3000` 运行。

### 启动后端
1. 在 `backend` 目录下运行：
   ```bash
   uvicorn app.main:app --reload
   ```
2. 后端将在 `http://localhost:8000` 运行。

## 5. 使用 Docker 运行（可选）

1. 在项目根目录下运行：
   ```bash
   docker-compose up --build
   ```
2. 前端将在 `http://localhost:3000` 运行，后端将在 `http://localhost:8000` 运行。

## 6. 测试

### 单元测试
1. 前端测试：
   ```bash
   pnpm test
   ```
2. 后端测试：
   ```bash
   pytest
   ```

### E2E 测试
1. 运行 Cypress：
   ```bash
   pnpm cypress:open
   ```

## 7. 代码格式化与检查

### 前端
```bash
pnpm lint
pnpm format
```

### 后端
```bash
black .
isort .
flake8 .
```

## 8. 提交代码

1. 确保所有测试通过：
   ```bash
   pnpm test && pytest
   ```
2. 格式化代码：
   ```bash
   pnpm format && black . && isort .
   ```
3. 提交代码：
   ```bash
   git add .
   git commit -m "your commit message"
   git push
   ```

## 9. 部署

### Vercel 部署（前端）
1. 安装 Vercel CLI：
   ```bash
   npm i -g vercel
   ```
2. 部署：
   ```bash
   vercel
   ```

### Heroku 部署（后端）
1. 安装 Heroku CLI
2. 登录 Heroku：
   ```bash
   heroku login
   ```
3. 创建应用：
   ```bash
   heroku create
   ```
4. 部署：
   ```bash
   git push heroku main
   ```

## 10. 其他资源

- [前端指南](FrontendGuide.md)
- [后端架构](BackendArch.md)
- [集成指南](IntegrationGuide.md)
- [技术栈](TechStack.md)
- [项目结构](ProjectTree.md)