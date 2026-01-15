#!/bin/bash

# ==============================
# 磁盘空间分析脚本
# ==============================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}磁盘空间分析报告${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""

# 1. 总体磁盘使用情况
echo -e "${GREEN}[1] 总体磁盘使用情况${NC}"
df -h | grep -E "Filesystem|/dev/"
echo ""

# 2. 根目录下各目录占用
echo -e "${GREEN}[2] 根目录下各目录占用 TOP 10${NC}"
du -h --max-depth=1 / 2>/dev/null | sort -rh | head -n 11
echo ""

# 3. Docker 占用空间
echo -e "${GREEN}[3] Docker 占用空间${NC}"
if command -v docker &> /dev/null; then
    echo "Docker 镜像："
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | head -n 20
    echo ""
    echo "Docker 容器："
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Size}}"
    echo ""
    echo "Docker 系统空间："
    docker system df
else
    echo "Docker 未安装"
fi
echo ""

# 4. 大文件查找（大于 100MB）
echo -e "${GREEN}[4] 大文件列表 (>100MB)${NC}"
find / -type f -size +100M 2>/dev/null | head -n 20 | while read file; do
    size=$(du -h "$file" 2>/dev/null | cut -f1)
    echo "$size  $file"
done
echo ""

# 5. 日志文件占用
echo -e "${GREEN}[5] 日志文件占用${NC}"
echo "系统日志："
du -sh /var/log/* 2>/dev/null | sort -rh | head -n 10
echo ""
echo "Docker 日志："
if [ -d /var/lib/docker/containers ]; then
    find /var/lib/docker/containers -name "*-json.log" -exec du -h {} \; 2>/dev/null | sort -rh | head -n 10
fi
echo ""

# 6. 包管理器缓存
echo -e "${GREEN}[6] 包管理器缓存${NC}"
if [ -d /var/cache/apt ]; then
    echo "APT 缓存："
    du -sh /var/cache/apt/* 2>/dev/null
fi
echo ""

# 7. 临时文件
echo -e "${GREEN}[7] 临时文件目录${NC}"
du -sh /tmp /var/tmp 2>/dev/null
echo ""

# 8. 用户目录占用
echo -e "${GREEN}[8] 用户目录占用${NC}"
du -h --max-depth=1 /root 2>/dev/null | sort -rh | head -n 10
du -h --max-depth=1 /home 2>/dev/null | sort -rh | head -n 10
echo ""

# 9. npm/node 缓存
echo -e "${GREEN}[9] Node.js 相关缓存${NC}"
if [ -d /root/.npm ]; then
    echo "NPM 缓存："
    du -sh /root/.npm 2>/dev/null
fi
if [ -d /opt/lingqi/node_modules ]; then
    echo "项目 node_modules："
    du -sh /opt/lingqi/node_modules 2>/dev/null
    du -sh /opt/lingqi/server/node_modules 2>/dev/null
fi
echo ""

# 10. 备份文件
echo -e "${GREEN}[10] 备份文件${NC}"
if [ -d /opt/lingqi-backups ]; then
    echo "项目备份："
    ls -lh /opt/lingqi-backups/
    du -sh /opt/lingqi-backups/
fi
echo ""

echo -e "${BLUE}===========================================${NC}"
echo -e "${YELLOW}分析完成！请查看上述报告确定清理目标${NC}"
echo -e "${BLUE}===========================================${NC}"
