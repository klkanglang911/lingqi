# ==============================
# 构建阶段
# ==============================
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖配置文件
COPY package*.json ./

# 安装所有依赖（包括 devDependencies，构建时需要 vite）
RUN npm ci && \
    npm cache clean --force

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# ==============================
# 运行阶段
# ==============================
FROM nginx:alpine

# 维护者信息
LABEL maintainer="klkanglang@gmail.com"
LABEL description="灵棋经占卜应用 - 前端服务"

# 安装 curl（用于健康检查）
RUN apk add --no-cache curl

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 设置正确的文件权限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
