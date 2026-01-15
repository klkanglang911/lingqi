# VPS 磁盘空间紧急清理指南

## ⚠️ 紧急情况：磁盘使用率 98%

**您的服务器配置：**
- 磁盘总容量：38GB
- 当前使用率：98%
- 可用空间：约 760MB

---

## 🚨 立即执行（5 分钟快速清理）

### 步骤 1：上传清理脚本

```bash
# SSH 连接到服务器
ssh root@your-server-ip

# 进入项目目录
cd /opt/lingqi

# 拉取最新代码（包含清理脚本）
git pull origin main

# 给脚本添加执行权限
chmod +x scripts/disk-analyze.sh
chmod +x scripts/disk-cleanup.sh
```

### 步骤 2：分析磁盘占用

```bash
# 运行分析脚本
bash scripts/disk-analyze.sh > disk-report.txt

# 查看报告
cat disk-report.txt
```

### 步骤 3：执行安全清理（推荐）

```bash
# 安全级别清理（推荐首先执行）
bash scripts/disk-cleanup.sh safe
```

**预计释放：2-5GB**

---

## 📊 清理级别说明

### 级别 1：安全清理 (safe) - 推荐

**清理内容：**
- ✅ APT 包管理器缓存
- ✅ Docker 未使用的镜像（悬空镜像）
- ✅ 已退出的容器
- ✅ 临时文件 (/tmp, /var/tmp)
- ✅ 7 天前的日志文件
- ✅ npm 缓存

**风险：** 无
**预计释放：** 2-5GB

```bash
bash scripts/disk-cleanup.sh safe
```

### 级别 2：激进清理 (aggressive)

**额外清理：**
- ⚠️ 所有未使用的 Docker 镜像
- ⚠️ Docker 容器日志（清空）
- ⚠️ 系统日志（保留 3 天）
- ⚠️ 旧备份（保留最新 3 个）

**风险：** 低（会删除未使用的镜像，重新部署时需要重新构建）
**预计释放：** 5-10GB

```bash
bash scripts/disk-cleanup.sh aggressive
```

### 级别 3：深度清理 (deep)

**额外清理：**
- 🔴 所有 Docker 数据（除了运行中的容器）
- 🔴 所有系统日志
- 🔴 所有备份文件
- 🔴 全局 npm 缓存

**风险：** 中等（会清理所有备份和日志，需要重新构建所有镜像）
**预计释放：** 10-15GB

```bash
bash scripts/disk-cleanup.sh deep
```

---

## 🔍 手动分析和清理

### 1. 查看磁盘使用情况

```bash
# 总体情况
df -h

# 根目录各子目录占用
du -h --max-depth=1 / | sort -rh | head -n 20

# 查找大文件 (>500MB)
find / -type f -size +500M -exec ls -lh {} \; 2>/dev/null
```

### 2. Docker 清理（重点）

Docker 通常是占用空间最多的：

```bash
# 查看 Docker 空间占用
docker system df

# 查看所有镜像
docker images

# 清理未使用的镜像（安全）
docker image prune -f

# 清理所有未使用的镜像（激进）
docker image prune -a -f

# 清理停止的容器
docker container prune -f

# 清理未使用的卷
docker volume prune -f

# 清理未使用的网络
docker network prune -f

# 全面清理（谨慎！）
docker system prune -a --volumes -f
```

### 3. 日志清理

```bash
# 查看日志占用
du -sh /var/log/*

# 清理系统日志（保留 3 天）
journalctl --vacuum-time=3d

# 清理系统日志（限制大小 100MB）
journalctl --vacuum-size=100M

# 清理 Docker 容器日志
find /var/lib/docker/containers -name "*-json.log" -exec truncate -s 0 {} \;

# 删除旧日志文件
find /var/log -type f -name "*.log" -mtime +7 -delete
find /var/log -type f -name "*.gz" -delete
```

### 4. 包管理器清理

```bash
# APT 缓存
apt-get clean
apt-get autoclean
apt-get autoremove -y

# 查看 APT 缓存大小
du -sh /var/cache/apt
```

### 5. 临时文件清理

```bash
# 临时目录
rm -rf /tmp/*
rm -rf /var/tmp/*

# 查看临时目录大小
du -sh /tmp /var/tmp
```

### 6. 备份文件清理

```bash
# 查看备份文件
ls -lh /opt/lingqi-backups/

# 删除旧备份（保留最新 3 个）
cd /opt/lingqi-backups
ls -t lingqi-backup-*.tar.gz | tail -n +4 | xargs rm -f
ls -t db-backup-*.tar.gz | tail -n +4 | xargs rm -f
```

### 7. npm 缓存清理

```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 npm 缓存目录
rm -rf ~/.npm
rm -rf /root/.npm

# 查看缓存大小
du -sh ~/.npm
```

---

## 🛡️ 长期优化方案

### 1. 配置 Docker 日志轮转

创建或编辑 `/etc/docker/daemon.json`：

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

重启 Docker：
```bash
systemctl restart docker
```

### 2. 配置 systemd 日志限制

编辑 `/etc/systemd/journald.conf`：

```ini
[Journal]
SystemMaxUse=100M
SystemMaxFileSize=10M
```

重启服务：
```bash
systemctl restart systemd-journald
```

### 3. 定期清理任务

创建定时任务：
```bash
crontab -e
```

添加每周清理任务：
```cron
# 每周日凌晨 3 点执行安全清理
0 3 * * 0 /opt/lingqi/scripts/disk-cleanup.sh safe > /var/log/disk-cleanup.log 2>&1

# 每天凌晨 2 点清理 Docker 日志
0 2 * * * find /var/lib/docker/containers -name "*-json.log" -exec truncate -s 0 {} \;
```

### 4. 监控磁盘使用率

安装监控工具：
```bash
apt-get install ncdu -y

# 使用 ncdu 分析磁盘（交互式）
ncdu /
```

设置告警脚本：
```bash
#!/bin/bash
THRESHOLD=80
USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

if [ $USAGE -gt $THRESHOLD ]; then
    echo "警告：磁盘使用率 ${USAGE}% 超过阈值 ${THRESHOLD}%"
    # 这里可以添加邮件或消息通知
fi
```

---

## 📋 清理效果预期

### 初次清理（98% 使用率）

| 清理项目 | 预计释放空间 | 风险等级 |
|---------|------------|---------|
| APT 缓存 | 200-500MB | 无 |
| Docker 悬空镜像 | 1-2GB | 无 |
| 临时文件 | 100-300MB | 无 |
| 旧日志文件 | 500MB-1GB | 低 |
| npm 缓存 | 100-500MB | 无 |
| Docker 未使用镜像 | 2-5GB | 低 |
| Docker 容器日志 | 500MB-2GB | 低 |
| 旧备份文件 | 1-3GB | 低 |
| **总计** | **5-15GB** | - |

### 清理后目标

- ✅ 磁盘使用率：60-70%
- ✅ 可用空间：10-15GB
- ✅ 系统稳定运行

---

## ⚠️ 注意事项

### 清理前务必：

1. **备份重要数据**
   ```bash
   # 备份数据库
   docker exec lingqi-server sh -c "cd /app/data && tar czf - ." > /root/emergency-backup.tar.gz
   ```

2. **记录当前运行的容器**
   ```bash
   docker ps > /root/running-containers.txt
   ```

3. **确认服务正常运行**
   ```bash
   docker-compose ps
   ```

### 清理后需要：

1. **检查服务状态**
   ```bash
   docker-compose ps
   docker-compose logs
   ```

2. **测试应用访问**
   ```bash
   curl http://localhost:4000
   curl http://localhost:3001/health
   ```

3. **如果服务异常，重新部署**
   ```bash
   cd /opt/lingqi
   bash deploy.sh
   ```

---

## 🔧 故障排查

### 问题 1：清理后服务无法启动

**原因：** Docker 镜像被清理

**解决：**
```bash
cd /opt/lingqi
docker-compose down
bash deploy.sh
```

### 问题 2：磁盘仍然满

**检查：**
```bash
# 查找大文件
find / -type f -size +1G -exec ls -lh {} \; 2>/dev/null

# 查找占用空间最多的目录
du -h --max-depth=1 / | sort -rh | head -n 20
```

### 问题 3：清理脚本执行失败

**手动执行：**
```bash
# 逐步执行清理命令
apt-get clean
docker image prune -f
rm -rf /tmp/*
journalctl --vacuum-time=3d
```

---

## 📞 紧急联系

如果清理后仍然空间不足，请考虑：

1. **临时扩容方案**
   - 挂载临时存储卷
   - 将日志转移到其他位置

2. **永久解决方案**
   - 升级服务器磁盘容量
   - 使用对象存储（如 S3）存储静态资源

3. **寻求支持**
   - GitHub Issues: https://github.com/klkanglang911/lingqi/issues
   - 邮箱: klkanglang@gmail.com

---

## ✅ 执行检查清单

清理前：
- [ ] 查看当前磁盘使用情况 (`df -h`)
- [ ] 备份重要数据
- [ ] 记录运行中的容器

执行清理：
- [ ] 运行分析脚本 (`disk-analyze.sh`)
- [ ] 执行安全清理 (`disk-cleanup.sh safe`)
- [ ] 检查释放的空间
- [ ] 如需更多空间，执行激进清理

清理后：
- [ ] 验证磁盘使用率降至 80% 以下
- [ ] 检查服务运行状态
- [ ] 测试应用访问
- [ ] 配置日志轮转（长期方案）
- [ ] 设置定期清理任务

---

**立即开始清理，确保系统稳定运行！🚀**
