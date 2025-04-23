FROM node:18-alpine as builder

WORKDIR /app

# Add build arguments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm with specific permissions
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM nginx:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]