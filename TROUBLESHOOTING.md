# 部署故障排查指南

## 🚨 常见部署错误及解决方案

### 错误 1：后端容器健康检查失败

**症状：**
```
✘ Container lingqi-server Error
dependency failed to start: container lingqi-server is unhealthy
```

**可能原因及解决方案：**

#### 原因 1：数据库初始化失败

**排查：**
```bash
# 查看后端日志
docker-compose logs server | grep -i "error\|prisma"
```

**解决方案 A：重置数据库**
```bash
# 停止容器
docker-compose down

# 删除旧数据卷
docker volume rm lingqi_server-data

# 重新启动
docker-compose up -d

# 实时查看日志
docker-compose logs -f server
```

**解决方案 B：手动初始化数据库**
```bash
# 进入容器
docker exec -it lingqi-server sh

# 手动执行数据库迁移
npx prisma db push --skip-generate

# 手动执行数据填充（可选）
npx prisma db seed

# 退出容器
exit

# 重启服务
docker-compose restart server
```

#### 原因 2：健康检查端点未响应

**排查：**
```bash
# 检查后端是否在运行
docker ps -a | grep lingqi-server

# 手动测试健康检查
docker exec lingqi-server curl -f http://localhost:3001/health
```

**解决方案：检查 /health 路由**

查看后端日志，确认服务是否启动：
```bash
docker-compose logs server | tail -n 50
```

应该看到类似输出：
```
Server is running on http://localhost:3001
```

如果没有，可能是代码问题，需要检查 `server/src/index.ts`。

#### 原因 3：端口冲突

**排查：**
```bash
# 检查 3001 端口是否被占用
lsof -i :3001
# 或
netstat -tuln | grep 3001
```

**解决方案：**

如果端口被占用：
```bash
# 方案 A：杀死占用进程
kill -9 $(lsof -t -i:3001)

# 方案 B：修改端口
# 编辑 .env 文件
nano .env
# 修改 SERVER_PORT=3002

# 重新部署
docker-compose down
docker-compose up -d
```

#### 原因 4：环境变量配置错误

**排查：**
```bash
# 检查 .env 文件
cat .env

# 检查容器内的环境变量
docker exec lingqi-server env | grep -E "NODE_ENV|DATABASE_URL|JWT_SECRET|PORT"
```

**解决方案：**

确保 `.env` 文件包含必要配置：
```bash
# 最小配置
NODE_ENV=production
JWT_SECRET=your-secret-key-here
FRONTEND_PORT=4000
SERVER_PORT=3001
```

修改后重启：
```bash
docker-compose down
docker-compose up -d
```

#### 原因 5：内存不足

**排查：**
```bash
# 检查系统内存
free -h

# 检查容器资源
docker stats lingqi-server
```

**解决方案：**

如果内存不足，临时增加 swap：
```bash
# 创建 2GB swap
dd if=/dev/zero of=/swapfile bs=1M count=2048
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 重新部署
docker-compose down
docker-compose up -d
```

#### 原因 6：数据目录权限问题

**排查：**
```bash
# 检查数据卷挂载
docker volume inspect lingqi_server-data

# 检查容器内权限
docker exec lingqi-server ls -la /app/data
```

**解决方案：**
```bash
# 删除旧卷重建
docker-compose down
docker volume rm lingqi_server-data
docker-compose up -d
```

---

### 错误 2：前端容器无法启动

**症状：**
```
✔ Container lingqi-frontend Created
dependency failed to start: container lingqi-server is unhealthy
```

**原因：**
前端依赖后端健康检查，后端未就绪导致。

**解决方案：**
先解决后端问题，前端会自动启动。

---

### 错误 3：Docker 构建失败

**症状：**
```
ERROR: failed to solve: process "/bin/sh -c npm run build" did not complete successfully
```

**原因：**
- TypeScript 编译错误
- 依赖安装失败
- 内存不足

**解决方案：**

```bash
# 1. 清理 Docker 缓存
docker system prune -a

# 2. 重新构建
docker-compose build --no-cache

# 3. 启动服务
docker-compose up -d
```

---

### 错误 4：磁盘空间不足

**症状：**
```
no space left on device
```

**解决方案：**

参考 `DISK_CLEANUP_GUIDE.md` 执行清理：
```bash
# 快速清理
bash scripts/disk-cleanup.sh safe

# 查看空间
df -h
```

---

## 🛠️ 通用排查流程

### 步骤 1：运行自动排查脚本

```bash
cd /opt/lingqi
git pull origin main
chmod +x scripts/debug-deployment.sh
bash scripts/debug-deployment.sh
```

这个脚本会自动检查：
- 容器状态
- 日志输出
- 端口占用
- 磁盘空间
- Docker 资源
- 环境变量
- 数据卷
- 网络配置

### 步骤 2：查看详细日志

```bash
# 后端日志（最重要）
docker-compose logs server

# 前端日志
docker-compose logs frontend

# 实时日志
docker-compose logs -f

# 只看错误
docker-compose logs server | grep -i error
```

### 步骤 3：检查容器状态

```bash
# 查看所有容器
docker-compose ps

# 查看容器详情
docker inspect lingqi-server

# 进入容器调试
docker exec -it lingqi-server sh
```

### 步骤 4：测试服务连接

```bash
# 测试后端健康检查
curl http://localhost:3001/health

# 测试前端
curl http://localhost:4000

# 从容器内测试
docker exec lingqi-server curl http://localhost:3001/health
```

---

## 🔧 快速修复命令集

### 完全重置并重新部署

```bash
# 停止所有服务
docker-compose down

# 清理所有数据
docker volume rm lingqi_server-data

# 清理镜像
docker rmi lingqi-frontend lingqi-server

# 重新部署
bash deploy.sh
```

### 仅重启服务

```bash
# 重启所有
docker-compose restart

# 只重启后端
docker-compose restart server

# 只重启前端
docker-compose restart frontend
```

### 查看实时资源使用

```bash
# 容器资源监控
docker stats

# 系统资源监控
htop
```

### 强制重建镜像

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📋 部署前检查清单

在执行 `deploy.sh` 之前，确保：

- [ ] 磁盘空间充足（至少 5GB 可用）
- [ ] 端口 3001 和 4000 未被占用
- [ ] `.env` 文件存在且配置正确
- [ ] Docker 服务正常运行
- [ ] 系统内存充足（至少 1GB 可用）
- [ ] 网络连接正常

检查命令：
```bash
# 磁盘空间
df -h / | grep -v "Filesystem"

# 端口检查
lsof -i :3001,4000 || echo "端口空闲"

# 环境变量
test -f .env && echo "✓ .env 存在" || echo "✗ .env 缺失"

# Docker
docker ps > /dev/null && echo "✓ Docker 正常" || echo "✗ Docker 异常"

# 内存
free -h | grep Mem
```

---

## 📞 获取帮助

如果以上方法都无法解决，请：

1. **收集诊断信息：**
```bash
bash scripts/debug-deployment.sh > debug-report.txt
docker-compose logs > logs.txt
```

2. **创建 Issue：**
前往 https://github.com/klkanglang911/lingqi/issues

附上：
- 错误信息
- debug-report.txt
- logs.txt
- 服务器配置信息

3. **邮件联系：**
klkanglang@gmail.com

---

## 🔍 日志分析示例

### 正常启动日志（后端）

```
[INFO] Prisma schema loaded
[INFO] Database connection established
[INFO] Running migrations...
[SUCCESS] Migrations completed
[INFO] Seeding database...
[SUCCESS] Seeding completed
[INFO] Server is running on http://localhost:3001
```

### 异常日志示例

#### 数据库错误
```
Error: P1003: Database does not exist
```
**解决：** 重置数据卷

#### 端口占用
```
Error: listen EADDRINUSE: address already in use :::3001
```
**解决：** 修改端口或杀死占用进程

#### 权限错误
```
Error: EACCES: permission denied
```
**解决：** 重置数据卷权限

#### 内存不足
```
Error: JavaScript heap out of memory
```
**解决：** 增加 swap 或升级服务器

---

## ✅ 验证部署成功

部署成功的标志：

```bash
# 1. 容器状态健康
docker-compose ps
# 输出应该显示：
# NAME               STATUS
# lingqi-frontend    Up (healthy)
# lingqi-server      Up (healthy)

# 2. 健康检查通过
curl http://localhost:3001/health
# 输出：{"status":"ok"}

# 3. API 可访问
curl http://localhost:3001/api/hexagrams
# 返回 JSON 数据

# 4. 前端可访问
curl -I http://localhost:4000
# 返回：HTTP/1.1 200 OK
```

如果以上全部通过，部署成功！🎉
