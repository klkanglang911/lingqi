# 灵棋经占卜应用 - Docker 部署指南

本文档详细说明如何在 VPS 上使用 Docker 部署灵棋经占卜应用。

## 📋 目录

- [系统要求](#系统要求)
- [快速开始](#快速开始)
- [详细步骤](#详细步骤)
- [环境变量配置](#环境变量配置)
- [常用命令](#常用命令)
- [故障排除](#故障排除)
- [性能优化](#性能优化)

---

## 系统要求

### 硬件要求
- CPU: 1 核心以上
- 内存: 1GB 以上
- 磁盘: 5GB 可用空间

### 软件要求
- 操作系统: Linux (Ubuntu 20.04+ / CentOS 7+ / Debian 10+)
- Docker: 20.10+
- Docker Compose: 1.29+
- Git: 2.x

---

## 快速开始

如果您的 VPS 已安装 Docker 和 Docker Compose，可以使用以下命令快速部署：

```bash
# 1. 克隆项目到 /opt/lingqi
cd /opt
git clone https://github.com/klkanglang911/lingqi.git lingqi

# 2. 进入项目目录
cd lingqi

# 3. 复制环境变量配置文件并编辑
cp .env.example .env
nano .env  # 或使用 vi/vim

# 4. 运行部署脚本
bash deploy.sh
```

部署完成后访问：
- **前端**: http://your-vps-ip:4000
- **后端**: http://your-vps-ip:3001

---

## 详细步骤

### 1. 安装 Docker 和 Docker Compose

#### Ubuntu/Debian

```bash
# 更新软件包索引
sudo apt update

# 安装必要的依赖
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# 添加 Docker 官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加 Docker 仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### CentOS/RHEL

```bash
# 安装必要的依赖
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

# 添加 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 2. 配置 Docker（可选但推荐）

```bash
# 将当前用户添加到 docker 组（避免每次使用 sudo）
sudo usermod -aG docker $USER

# 重新登录以使更改生效
# 或运行：
newgrp docker

# 配置 Docker 镜像加速（中国大陆用户）
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com"
  ]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 3. 克隆项目

```bash
# 创建项目目录
sudo mkdir -p /opt
cd /opt

# 克隆项目（需要 Git）
sudo git clone https://github.com/klkanglang911/lingqi.git lingqi

# 设置目录权限
sudo chown -R $USER:$USER /opt/lingqi
cd /opt/lingqi
```

### 4. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑环境变量
nano .env
```

**重要配置项**：
```env
# Gemini API 密钥（必填）
GEMINI_API_KEY=your_actual_api_key

# JWT 密钥（生产环境必须修改）
JWT_SECRET=$(openssl rand -base64 32)

# 端口配置（可选）
FRONTEND_PORT=4000
SERVER_PORT=3001
```

### 5. 首次部署

```bash
# 运行部署脚本
bash deploy.sh
```

脚本会自动执行：
1. ✅ 检查运行环境
2. ✅ 备份当前版本（如果存在）
3. ✅ 拉取最新代码
4. ✅ 检查环境变量
5. ✅ 停止旧容器
6. ✅ 清理未使用的镜像
7. ✅ 构建新镜像并启动服务
8. ✅ 等待服务就绪
9. ✅ 显示服务状态

### 6. 验证部署

```bash
# 检查容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 测试前端
curl http://localhost:4000

# 测试后端健康检查
curl http://localhost:3001/health
```

---

## 环境变量配置

### 完整配置说明

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `GEMINI_API_KEY` | Google Gemini API 密钥 | - | ✅ |
| `JWT_SECRET` | JWT 签名密钥 | 默认值（不安全） | ✅ |
| `FRONTEND_PORT` | 前端服务端口 | 4000 | ❌ |
| `SERVER_PORT` | 后端服务端口 | 3001 | ❌ |
| `NODE_ENV` | 运行环境 | production | ❌ |
| `DATABASE_URL` | 数据库连接 | file:/app/data/prod.db | ❌ |

### 获取 Gemini API 密钥

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录 Google 账号
3. 点击 "Get API Key"
4. 复制生成的 API 密钥
5. 粘贴到 `.env` 文件中

### 生成安全的 JWT_SECRET

```bash
# 使用 OpenSSL 生成随机密钥
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 常用命令

### 部署相关

```bash
# 首次部署或更新
bash deploy.sh

# 回滚到上一个版本
bash deploy.sh --rollback

# 仅重启服务（不更新代码）
docker-compose restart

# 停止服务
docker-compose stop

# 启动服务
docker-compose start

# 完全停止并删除容器
docker-compose down
```

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 实时查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs frontend
docker-compose logs server

# 查看最近 100 行日志
docker-compose logs --tail=100
```

### 数据库管理

```bash
# 进入后端容器
docker exec -it lingqi-server sh

# 在容器内执行 Prisma 命令
npx prisma studio  # 打开数据库管理界面
npx prisma db push  # 同步数据库结构
npx prisma db seed  # 填充种子数据
```

### 备份与恢复

```bash
# 手动备份数据库
docker exec lingqi-server sh -c "cd /app/data && tar czf - ." > backup-$(date +%Y%m%d).tar.gz

# 恢复数据库
docker exec -i lingqi-server sh -c "cd /app/data && tar xzf -" < backup-20260115.tar.gz
```

---

## 故障排除

### 问题 1: 容器无法启动

**症状**：`docker-compose up` 失败

**解决方案**：
```bash
# 查看详细错误日志
docker-compose logs

# 检查端口是否被占用
sudo lsof -i :4000
sudo lsof -i :3001

# 清理所有容器和镜像，重新构建
docker-compose down -v
docker system prune -a
bash deploy.sh
```

### 问题 2: 健康检查失败

**症状**：容器显示 "unhealthy"

**解决方案**：
```bash
# 查看健康检查日志
docker inspect lingqi-frontend | grep -A 10 Health
docker inspect lingqi-server | grep -A 10 Health

# 进入容器手动测试
docker exec -it lingqi-frontend curl -f http://localhost/
docker exec -it lingqi-server curl -f http://localhost:3001/health
```

### 问题 3: 前端无法连接后端

**症状**：前端加载成功，但 API 请求失败

**解决方案**：
```bash
# 检查网络连接
docker network inspect lingqi_lingqi-network

# 测试容器间连通性
docker exec lingqi-frontend ping server

# 检查 nginx 配置
docker exec lingqi-frontend cat /etc/nginx/conf.d/default.conf
```

### 问题 4: 数据库迁移失败

**症状**：后端启动时报错 "Prisma migrate failed"

**解决方案**：
```bash
# 进入后端容器
docker exec -it lingqi-server sh

# 手动执行数据库迁移
npx prisma db push --force-reset  # 注意：会清空数据！
npx prisma generate
```

---

## 性能优化

### 1. 配置反向代理（推荐使用 Nginx）

在 VPS 上安装 Nginx 作为反向代理：

```bash
# 安装 Nginx
sudo apt install nginx

# 创建配置文件
sudo nano /etc/nginx/sites-available/lingqi
```

配置内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/lingqi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. 配置 HTTPS（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 3. 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M

  server:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          memory: 512M
```

### 4. 日志轮转

已在 `docker-compose.yml` 中配置：
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

---

## 监控与维护

### 查看系统资源使用

```bash
# 查看容器资源使用情况
docker stats

# 查看磁盘使用
docker system df

# 清理未使用的资源
docker system prune -a
```

### 定期备份

建议设置 cron 任务定期备份：

```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 2 点备份
0 2 * * * docker exec lingqi-server sh -c "cd /app/data && tar czf - ." > /opt/lingqi-backups/auto-backup-$(date +\%Y\%m\%d).tar.gz
```

---

## 安全建议

1. ✅ **修改默认端口**：避免使用常见端口
2. ✅ **配置防火墙**：只开放必要的端口
3. ✅ **使用强密码**：JWT_SECRET 使用强随机字符串
4. ✅ **启用 HTTPS**：使用 SSL/TLS 加密传输
5. ✅ **定期更新**：保持 Docker 和系统软件最新
6. ✅ **限制访问**：使用防火墙规则限制访问来源
7. ✅ **备份数据**：定期备份数据库

---

## 联系支持

如有问题，请提交 Issue：
https://github.com/klkanglang911/lingqi/issues

---

**最后更新**: 2026-01-15
**版本**: 1.0.0
