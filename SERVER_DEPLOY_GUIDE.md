# 灵棋经占卜应用 - 服务器部署指南

## 服务器配置要求

**最低配置：**
- CPU: 1 核
- 内存: 1GB
- 硬盘: 10GB

**推荐配置（您的配置）：**
- ✅ CPU: 2 核
- ✅ 内存: 2.4GB
- ✅ 硬盘: 38GB

您的配置完全满足要求！

---

## 首次部署步骤

### 1. 安装必要软件

```bash
# 更新系统包
apt-get update && apt-get upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
apt-get install docker-compose -y

# 安装 Git
apt-get install git -y

# 安装 tmux（防止 SSH 断开）
apt-get install tmux -y
```

### 2. 克隆项目

```bash
# 创建项目目录
mkdir -p /opt
cd /opt

# 克隆仓库
git clone https://github.com/klkanglang911/lingqi.git
cd lingqi
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量（重要！）
nano .env
```

**必须修改的配置：**
```bash
# JWT 密钥（生产环境必须改成随机字符串）
JWT_SECRET=your-super-secret-jwt-key-here-change-me

# Gemini API Key（如需 AI 功能）
GEMINI_API_KEY=your-gemini-api-key

# 端口配置（默认值）
FRONTEND_PORT=4000
SERVER_PORT=3001
```

💡 **生成安全的 JWT_SECRET：**
```bash
openssl rand -base64 32
```

### 4. 使用 tmux 部署（推荐）

**为什么使用 tmux？**
- ✅ 防止 SSH 断开导致部署中断
- ✅ 随时可以重新连接查看进度
- ✅ 支持后台运行

```bash
# 创建 tmux 会话
tmux new -s deploy

# 在 tmux 会话中运行部署
cd /opt/lingqi
bash deploy.sh

# 如果 SSH 断开，重新连接后恢复会话
tmux attach -t deploy
```

**tmux 快捷键：**
- `Ctrl+B` 然后按 `D`：退出会话但保持运行
- `tmux ls`：查看所有会话
- `tmux attach -t deploy`：重新连接到会话

### 5. 查看部署进度

部署脚本现在会显示详细进度：

```
==========================================
灵棋经占卜应用 - 一键部署脚本
==========================================

[INFO] 检查运行环境...
[SUCCESS] 环境检查通过
[INFO] 备份当前版本...
[SUCCESS] 备份完成: lingqi-backup-20260115-070000.tar.gz
[INFO] 拉取最新代码...
[SUCCESS] 代码更新完成
[INFO] 构建新镜像并启动服务...
[INFO] 当前系统资源状态：
              total        used        free      shared  buff/cache   available
Mem:          2.4Gi       512Mi       1.5Gi       8.0Mi       400Mi       1.8Gi

[INFO] 步骤 1/3: 构建后端镜像...
[SUCCESS] 后端镜像构建完成
[INFO] 步骤 2/3: 构建前端镜像...
[SUCCESS] 前端镜像构建完成
[INFO] 步骤 3/3: 启动所有服务...
[SUCCESS] 服务启动成功
```

---

## 部署后验证

### 1. 检查容器状态

```bash
docker-compose ps
```

**预期输出：**
```
NAME               STATUS          PORTS
lingqi-frontend    Up (healthy)    0.0.0.0:4000->80/tcp
lingqi-server      Up (healthy)    0.0.0.0:3001->3001/tcp
```

### 2. 查看服务日志

```bash
# 查看所有日志
docker-compose logs

# 实时查看日志
docker-compose logs -f

# 只查看后端日志
docker-compose logs -f server

# 只查看前端日志
docker-compose logs -f frontend
```

### 3. 测试 API 接口

```bash
# 测试后端健康检查
curl http://localhost:3001/health

# 测试获取卦象列表
curl http://localhost:3001/api/hexagrams

# 测试前端访问
curl http://localhost:4000
```

### 4. 浏览器访问

```
前端：http://your-server-ip:4000
后端：http://your-server-ip:3001
```

---

## 常见问题排查

### 问题 1：SSH 连接断开

**原因：**
- 网络不稳定
- 构建过程耗时较长
- SSH 客户端超时

**解决方案：**
✅ **使用 tmux（强烈推荐）**
```bash
tmux new -s deploy
cd /opt/lingqi && bash deploy.sh
```

✅ **配置 SSH 保活（本地电脑）**

编辑 `~/.ssh/config`：
```
Host *
    ServerAliveInterval 30
    ServerAliveCountMax 5
```

✅ **使用后台运行**
```bash
nohup bash deploy.sh > deploy.log 2>&1 &
tail -f deploy.log
```

### 问题 2：构建失败

**检查日志：**
```bash
docker-compose logs server
docker-compose logs frontend
```

**清理并重试：**
```bash
# 停止所有容器
docker-compose down

# 清理所有镜像和缓存
docker system prune -a

# 重新部署
bash deploy.sh
```

### 问题 3：端口被占用

**检查端口占用：**
```bash
# 检查 4000 端口
lsof -i :4000

# 检查 3001 端口
lsof -i :3001
```

**修改端口：**
编辑 `.env` 文件：
```bash
FRONTEND_PORT=8080
SERVER_PORT=8081
```

### 问题 4：内存不足

**查看内存使用：**
```bash
free -h
docker stats
```

**优化措施：**
```bash
# 清理未使用的 Docker 资源
docker system prune -a

# 重启 Docker 服务
systemctl restart docker
```

---

## 日常运维命令

### 查看服务状态
```bash
cd /opt/lingqi
docker-compose ps
```

### 重启服务
```bash
# 重启所有服务
docker-compose restart

# 只重启后端
docker-compose restart server

# 只重启前端
docker-compose restart frontend
```

### 停止服务
```bash
docker-compose stop
```

### 启动服务
```bash
docker-compose start
```

### 更新部署
```bash
cd /opt/lingqi
bash deploy.sh
```

### 回滚到上一个版本
```bash
cd /opt/lingqi
bash deploy.sh --rollback
```

### 查看备份列表
```bash
ls -lh /opt/lingqi-backups/
```

### 清理日志
```bash
# 清理 Docker 日志
docker system prune -f

# 清理应用日志
docker-compose logs --tail=0
```

---

## 资源监控

### 实时监控容器资源
```bash
docker stats
```

### 查看系统资源
```bash
# 内存使用
free -h

# CPU 使用
top

# 磁盘使用
df -h
```

### 设置监控告警（可选）

安装 `htop` 进行更直观的监控：
```bash
apt-get install htop -y
htop
```

---

## 安全建议

### 1. 修改默认 JWT_SECRET
```bash
# 生成随机密钥
openssl rand -base64 32

# 更新 .env 文件
nano /opt/lingqi/.env
```

### 2. 配置防火墙
```bash
# 安装 ufw
apt-get install ufw -y

# 开放必要端口
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 4000/tcp  # 前端
ufw allow 3001/tcp  # 后端

# 启用防火墙
ufw enable
```

### 3. 配置 HTTPS（可选但推荐）

使用 Nginx + Let's Encrypt：
```bash
# 安装 Certbot
apt-get install certbot python3-certbot-nginx -y

# 获取证书
certbot --nginx -d your-domain.com
```

### 4. 定期备份数据库
```bash
# 手动备份
docker exec lingqi-server sh -c "cd /app/data && tar czf - ." > backup.tar.gz

# 设置自动备份（crontab）
crontab -e

# 添加每天凌晨 2 点备份
0 2 * * * docker exec lingqi-server sh -c "cd /app/data && tar czf - ." > /opt/backups/db-$(date +\%Y\%m\%d).tar.gz
```

---

## 性能优化建议

### 1. 启用 Docker 构建缓存
已在 Dockerfile 中配置多阶段构建，自动利用缓存。

### 2. 资源限制已配置
- 前端容器：最大 256MB 内存、0.5 CPU
- 后端容器：最大 512MB 内存、1.0 CPU

### 3. 日志轮转已配置
- 每个容器日志最大 10MB
- 保留最近 3 个日志文件

---

## 升级指南

### 从旧版本升级

```bash
cd /opt/lingqi

# 1. 备份当前版本
bash deploy.sh

# 2. 脚本会自动：
#    - 备份数据库
#    - 拉取最新代码
#    - 重新构建镜像
#    - 启动新版本

# 3. 如果出现问题，回滚
bash deploy.sh --rollback
```

---

## 联系支持

- **GitHub Issues**: https://github.com/klkanglang911/lingqi/issues
- **邮箱**: klkanglang@gmail.com

---

## 附录：完整部署检查清单

- [ ] 服务器配置满足要求（2CPU / 2.4GB RAM）
- [ ] Docker 和 Docker Compose 已安装
- [ ] 项目已克隆到 `/opt/lingqi`
- [ ] `.env` 文件已配置（JWT_SECRET 已修改）
- [ ] 使用 tmux 会话运行部署
- [ ] 部署脚本执行成功
- [ ] 容器状态显示 `Up (healthy)`
- [ ] API 接口可访问（curl 测试通过）
- [ ] 浏览器可以打开前端页面
- [ ] 配置了防火墙规则
- [ ] 设置了定期备份（可选）
- [ ] 配置了 HTTPS（可选但推荐）

---

**部署完成！祝您使用愉快！🎉**
