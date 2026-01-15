# ==============================
# 依赖安装阶段
# ==============================
FROM node:22-alpine AS deps

WORKDIR /app

# 安装 Prisma 所需的依赖
RUN apk add --no-cache openssl libc6-compat

# 复制依赖配置文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci --only=production && \
    npm cache clean --force

# ==============================
# 构建阶段
# ==============================
FROM node:22-alpine AS builder

WORKDIR /app

# 安装 OpenSSL（Prisma 需要）
RUN apk add --no-cache openssl

# 复制依赖配置文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装所有依赖（包括 devDependencies，构建时需要 typescript）
RUN npm ci

# 复制源代码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 构建 TypeScript
RUN npm run build

# ==============================
# 运行阶段
# ==============================
FROM node:22-alpine

# 维护者信息
LABEL maintainer="klkanglang@gmail.com"
LABEL description="灵棋经占卜应用 - 后端服务"

WORKDIR /app

# 安装运行时依赖
RUN apk add --no-cache \
    openssl \
    curl \
    dumb-init

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 从依赖阶段复制 node_modules
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# 从构建阶段复制构建产物
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# 创建数据目录并设置权限
RUN mkdir -p /app/data && \
    chown -R nodejs:nodejs /app/data

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# 使用 dumb-init 处理信号
ENTRYPOINT ["dumb-init", "--"]

# 启动命令（先迁移数据库，再启动服务）
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm start"]
