FROM node:18-alpine

WORKDIR /app

# Add build arguments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
# 降低 Node.js 内存限制到 2GB
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm with specific permissions
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm build

EXPOSE 4173
# 使用 pnpm preview 来启动生产环境服务器
CMD ["pnpm", "preview", "--host"]