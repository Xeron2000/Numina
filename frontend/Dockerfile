FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install -g pnpm

COPY . .

RUN pnpm install

CMD ["pnpm", "dev"]