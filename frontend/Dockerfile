FROM node:18-alpine

WORKDIR /app

# Add build arguments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
# 设置 Node.js 内存限制
ENV NODE_OPTIONS="--max_old_space_size=4096"

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