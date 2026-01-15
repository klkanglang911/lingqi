#!/bin/bash

# ==============================
# 磁盘空间安全清理脚本
# 使用方法: bash disk-cleanup.sh [level]
# level: safe (默认) | aggressive | deep
# ==============================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 清理级别
LEVEL=${1:-safe}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示磁盘空间
show_disk_space() {
    echo ""
    echo -e "${GREEN}当前磁盘使用情况：${NC}"
    df -h / | grep -E "Filesystem|/"
    echo ""
}

# 计算释放的空间
calculate_freed_space() {
    local before=$1
    local after=$2
    local freed=$((before - after))
    local freed_gb=$(echo "scale=2; $freed / 1024 / 1024" | bc)
    echo "${freed_gb}GB"
}

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}磁盘空间清理脚本${NC}"
echo -e "${BLUE}清理级别: ${LEVEL}${NC}"
echo -e "${BLUE}===========================================${NC}"

# 显示初始磁盘空间
show_disk_space

# 记录清理前的空间（KB）
BEFORE_CLEANUP=$(df / | tail -1 | awk '{print $3}')

# ==============================
# 级别 1: 安全清理 (safe)
# ==============================

if [ "$LEVEL" = "safe" ] || [ "$LEVEL" = "aggressive" ] || [ "$LEVEL" = "deep" ]; then
    echo -e "${GREEN}[级别 1] 安全清理开始...${NC}"
    echo ""

    # 1. 清理 APT 缓存
    log_info "清理 APT 包管理器缓存..."
    apt-get clean
    apt-get autoclean
    apt-get autoremove -y
    log_success "APT 缓存清理完成"

    # 2. 清理 Docker 未使用的资源
    if command -v docker &> /dev/null; then
        log_info "清理 Docker 未使用的镜像、容器、网络..."

        # 停止已退出的容器
        EXITED=$(docker ps -a -q -f status=exited)
        if [ ! -z "$EXITED" ]; then
            docker rm $EXITED
            log_success "清理已退出的容器"
        fi

        # 删除悬空镜像
        docker image prune -f

        # 清理未使用的网络
        docker network prune -f

        log_success "Docker 清理完成"
    fi

    # 3. 清理临时文件
    log_info "清理临时文件..."
    rm -rf /tmp/*
    rm -rf /var/tmp/*
    log_success "临时文件清理完成"

    # 4. 清理日志（保留最近 7 天）
    log_info "清理旧日志文件（保留最近 7 天）..."
    find /var/log -type f -name "*.log" -mtime +7 -delete 2>/dev/null || true
    find /var/log -type f -name "*.gz" -mtime +7 -delete 2>/dev/null || true
    log_success "旧日志清理完成"

    # 5. 清理 npm 缓存
    if command -v npm &> /dev/null; then
        log_info "清理 npm 缓存..."
        npm cache clean --force 2>/dev/null || true
        log_success "npm 缓存清理完成"
    fi

    echo ""
    log_success "级别 1 清理完成"
    show_disk_space
fi

# ==============================
# 级别 2: 激进清理 (aggressive)
# ==============================

if [ "$LEVEL" = "aggressive" ] || [ "$LEVEL" = "deep" ]; then
    echo -e "${YELLOW}[级别 2] 激进清理开始...${NC}"
    echo ""

    # 1. 清理所有未使用的 Docker 镜像
    if command -v docker &> /dev/null; then
        log_warning "清理所有未使用的 Docker 镜像..."
        docker image prune -a -f
        log_success "Docker 镜像清理完成"
    fi

    # 2. 清理 Docker 容器日志
    log_warning "清理 Docker 容器日志..."
    if [ -d /var/lib/docker/containers ]; then
        find /var/lib/docker/containers -name "*-json.log" -exec truncate -s 0 {} \;
        log_success "Docker 容器日志已清空"
    fi

    # 3. 清理系统日志
    log_warning "清理系统日志..."
    journalctl --vacuum-time=3d 2>/dev/null || true
    journalctl --vacuum-size=100M 2>/dev/null || true
    log_success "系统日志清理完成"

    # 4. 清理旧备份（保留最新 3 个）
    if [ -d /opt/lingqi-backups ]; then
        log_warning "清理旧备份文件（保留最新 3 个）..."
        cd /opt/lingqi-backups
        ls -t lingqi-backup-*.tar.gz 2>/dev/null | tail -n +4 | xargs -r rm -f
        ls -t db-backup-*.tar.gz 2>/dev/null | tail -n +4 | xargs -r rm -f
        log_success "旧备份清理完成"
    fi

    # 5. 清理 systemd 日志
    log_warning "清理 systemd 日志..."
    rm -rf /var/log/journal/* 2>/dev/null || true
    log_success "systemd 日志清理完成"

    echo ""
    log_success "级别 2 清理完成"
    show_disk_space
fi

# ==============================
# 级别 3: 深度清理 (deep)
# ==============================

if [ "$LEVEL" = "deep" ]; then
    echo -e "${RED}[级别 3] 深度清理开始...${NC}"
    echo ""
    log_warning "警告：此级别会清理更多数据，请确认！"
    read -p "是否继续？(yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        log_info "取消深度清理"
    else
        # 1. 清理 Docker 所有数据（除了运行中的容器）
        if command -v docker &> /dev/null; then
            log_warning "执行 Docker 系统全面清理..."
            docker system prune -a --volumes -f
            log_success "Docker 系统清理完成"
        fi

        # 2. 清理所有日志
        log_warning "清理所有系统日志..."
        find /var/log -type f -delete 2>/dev/null || true
        log_success "系统日志全部清理"

        # 3. 清理所有备份
        if [ -d /opt/lingqi-backups ]; then
            log_warning "清理所有备份文件..."
            rm -rf /opt/lingqi-backups/*
            log_success "所有备份已清理"
        fi

        # 4. 清理 .npm 缓存
        if [ -d /root/.npm ]; then
            log_warning "清理 npm 全局缓存..."
            rm -rf /root/.npm
            log_success "npm 缓存清理完成"
        fi

        echo ""
        log_success "级别 3 清理完成"
        show_disk_space
    fi
fi

# ==============================
# 总结
# ==============================

# 记录清理后的空间（KB）
AFTER_CLEANUP=$(df / | tail -1 | awk '{print $3}')

# 计算释放的空间
FREED=$(calculate_freed_space $BEFORE_CLEANUP $AFTER_CLEANUP)

echo ""
echo -e "${BLUE}===========================================${NC}"
echo -e "${GREEN}清理完成！${NC}"
echo -e "${GREEN}释放空间: ${FREED}${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""

# 最终磁盘状态
show_disk_space

# 建议
echo -e "${YELLOW}后续建议：${NC}"
echo "1. 定期运行此脚本清理磁盘"
echo "2. 配置 Docker 日志轮转限制"
echo "3. 监控磁盘使用率，设置告警"
echo "4. 考虑升级磁盘容量（如长期超过 80%）"
echo ""
