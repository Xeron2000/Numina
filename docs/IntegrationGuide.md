# 前后端集成指南

## 一、技术栈集成概述
- **前端**：Next.js 14 (App Router) + TailwindCSS + DaisyUI
- **后端**：FastAPI + SQLite + SQLAlchemy 2.0
- **数据交互**：HTTP/2 + Protobuf

## 二、核心接口与路由映射
### 1. 数据分析模块
```mermaid
graph LR
    A[前端路由] --> B[后端接口]
    A1[/dashboard/analysis] --> B1[/api/v1/analysis]
    A2[/dashboard/analysis/templates] --> B2[/api/v1/analysis/templates]
```

#### 1.1 数据分析接口
```python
# 后端实现 (FastAPI)
@app.get("/api/v1/analysis/{dataset_id}")
async def get_analysis(dataset_id: int):
    # 数据处理逻辑
    return {"result": processed_data}
```

```typescript
// 前端路由 (Next.js)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const datasetId = searchParams.get('datasetId')
  const response = await axios.get(`/api/v1/analysis/${datasetId}`)
  return NextResponse.json(response.data)
}
```

#### 1.2 分析模板接口
```python
# 后端实现
@app.get("/api/v1/analysis/templates")
async def get_templates():
    return {"templates": analysis_templates}
```

```typescript
// 前端路由
export async function GET() {
  const response = await axios.get('/api/v1/analysis/templates')
  return NextResponse.json(response.data)
}
```

### 2. 数据管理模块
```mermaid
graph LR
    A[前端路由] --> B[后端接口]
    A1[/dashboard/datasets] --> B1[/api/v1/datasets]
    A2[/dashboard/datasets/upload] --> B2[/api/v1/upload]
```

#### 2.1 数据集列表接口
```python
# 后端实现
@app.get("/api/v1/datasets")
async def list_datasets():
    return {"datasets": dataset_list}
```

```typescript
// 前端路由
export async function GET() {
  const response = await axios.get('/api/v1/datasets')
  return NextResponse.json(response.data)
}
```

#### 2.2 文件上传接口
```python
# 后端实现
@app.post("/api/v1/upload")
async def upload_file(file: UploadFile):
    # 文件处理逻辑
    return {"status": "success"}
```

```typescript
// 前端路由
export async function POST(request: Request) {
  const formData = await request.formData()
  const response = await axios.post('/api/v1/upload', formData)
  return NextResponse.json(response.data)
}
```

## 三、安全集成
### 1. JWT认证
```python
# 后端实现
@app.post("/api/v1/auth/login")
async def login(user: User):
    # 认证逻辑
    return {"token": jwt_token}
```

```typescript
// 前端实现
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 2. CORS配置
```python
# 后端实现
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 四、性能优化
1. 使用HTTP/2协议
2. 实现API响应缓存
3. 配置gzip压缩
4. 使用WebSocket实时更新

## 五、测试方案
1. 接口自动化测试
2. 性能压力测试
3. 安全渗透测试
4. 端到端集成测试