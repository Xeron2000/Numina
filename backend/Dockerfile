FROM python:3.11-slim as builder

WORKDIR /app

# 安装编译依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim

WORKDIR /app

# 创建非root用户
RUN adduser --disabled-password --gecos '' appuser

# 创建数据目录
RUN mkdir -p /app/data && chown -R appuser:appuser /app/data

# 复制依赖
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY . .

# 设置权限
RUN chown -R appuser:appuser /app
USER appuser

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]