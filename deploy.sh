#!/bin/bash

# ==============================
# 灵棋经占卜应用一键部署脚本
# 使用方法: bash deploy.sh [--rollback]
# ==============================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_DIR="/opt/lingqi"
BACKUP_DIR="/opt/lingqi-backups"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# 日志函数
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

# 错误处理
error_exit() {
    log_error "$1"
    exit 1
}

# 打印分隔线
print_separator() {
    echo "=========================================="
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        error_exit "$1 未安装，请先安装 $1"
    fi
}

# 检查环境
check_environment() {
    log_info "检查运行环境..."
    check_command "git"
    check_command "docker"
    check_command "docker-compose"

    if [ ! -d "$PROJECT_DIR" ]; then
        error_exit "项目目录 $PROJECT_DIR 不存在"
    fi

    log_success "环境检查通过"
}

# 备份当前版本
backup_current_version() {
    log_info "备份当前版本..."

    # 创建备份目录
    mkdir -p "$BACKUP_DIR"

    # 备份文件名（包含时间戳）
    BACKUP_NAME="lingqi-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

    # 导出当前容器数据
    if [ "$(docker ps -q -f name=lingqi-server)" ]; then
        docker exec lingqi-server sh -c "cd /app/data && tar czf - ." > "$BACKUP_DIR/db-backup-$(date +%Y%m%d-%H%M%S).tar.gz" 2>/dev/null || true
    fi

    # 记录当前 git commit
    cd "$PROJECT_DIR"
    git rev-parse HEAD > "$BACKUP_DIR/last-commit.txt"

    log_success "备份完成: $BACKUP_NAME"
}

# 回滚到上一个版本
rollback() {
    log_warning "开始回滚到上一个版本..."

    if [ ! -f "$BACKUP_DIR/last-commit.txt" ]; then
        error_exit "未找到备份信息，无法回滚"
    fi

    LAST_COMMIT=$(cat "$BACKUP_DIR/last-commit.txt")

    cd "$PROJECT_DIR"
    git reset --hard "$LAST_COMMIT"

    log_info "重新构建并启动服务..."
    docker-compose -f "$COMPOSE_FILE" up -d --build

    log_success "回滚完成！"
    exit 0
}

# 拉取最新代码
pull_latest_code() {
    log_info "拉取最新代码..."
    cd "$PROJECT_DIR"

    # 保存本地修改（如果有）
    git stash || true

    # 拉取最新代码
    git pull origin main || error_exit "拉取代码失败"

    log_success "代码更新完成"
}

# 检查环境变量
check_env_file() {
    log_info "检查环境变量配置..."

    if [ ! -f "$PROJECT_DIR/$ENV_FILE" ]; then
        log_warning "未找到 .env 文件，将使用默认配置"
        log_warning "建议创建 .env 文件并配置以下变量："
        echo "  - JWT_SECRET"
        echo "  - FRONTEND_PORT"
        echo "  - SERVER_PORT"
    else
        log_success "环境变量配置文件存在"
    fi
}

# 停止旧容器
stop_old_containers() {
    log_info "停止旧容器..."
    docker-compose -f "$COMPOSE_FILE" down || true
    log_success "旧容器已停止"
}

# 清理未使用的镜像
cleanup_images() {
    log_info "清理未使用的 Docker 镜像..."
    docker image prune -f || true
    log_success "镜像清理完成"
}

# 构建并启动服务
build_and_start() {
    log_info "构建新镜像并启动服务..."

    # 显示当前系统资源
    log_info "当前系统资源状态："
    free -h | grep -E "Mem|Swap" || true
    echo ""

    # 串行构建镜像（避免内存峰值）
    log_info "步骤 1/3: 构建后端镜像..."
    docker-compose -f "$COMPOSE_FILE" build server || error_exit "后端镜像构建失败"
    log_success "后端镜像构建完成"

    log_info "步骤 2/3: 构建前端镜像..."
    docker-compose -f "$COMPOSE_FILE" build frontend || error_exit "前端镜像构建失败"
    log_success "前端镜像构建完成"

    # 启动服务
    log_info "步骤 3/3: 启动所有服务..."
    docker-compose -f "$COMPOSE_FILE" up -d || error_exit "服务启动失败"

    log_success "服务启动成功"
}

# 等待服务就绪
wait_for_services() {
    log_info "等待服务就绪..."

    # 等待最多 60 秒
    TIMEOUT=60
    ELAPSED=0

    while [ $ELAPSED -lt $TIMEOUT ]; do
        if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up (healthy)"; then
            log_success "服务已就绪"
            return 0
        fi
        sleep 2
        ELAPSED=$((ELAPSED + 2))
        echo -n "."
    done

    echo ""
    log_warning "服务启动超时，请检查日志"
}

# 显示服务状态
show_status() {
    log_info "服务状态:"
    docker-compose -f "$COMPOSE_FILE" ps

    echo ""
    log_info "访问地址:"
    echo "  前端: http://$(hostname -I | awk '{print $1}'):${FRONTEND_PORT:-4000}"
    echo "  后端: http://$(hostname -I | awk '{print $1}'):${SERVER_PORT:-3001}"
}

# 显示日志
show_logs() {
    echo ""
    log_info "最近的日志:"
    docker-compose -f "$COMPOSE_FILE" logs --tail=20
}

# 主函数
main() {
    print_separator
    echo -e "${GREEN}灵棋经占卜应用 - 一键部署脚本${NC}"
    print_separator
    echo ""

    # 检查是否是回滚操作
    if [ "$1" = "--rollback" ]; then
        rollback
    fi

    # 执行部署流程
    check_environment
    backup_current_version
    pull_latest_code
    check_env_file
    stop_old_containers
    cleanup_images
    build_and_start
    wait_for_services
    show_status

    echo ""
    print_separator
    log_success "部署完成！"
    print_separator
    echo ""
    echo "常用命令:"
    echo "  查看日志: docker-compose -f $COMPOSE_FILE logs -f"
    echo "  停止应用: docker-compose -f $COMPOSE_FILE stop"
    echo "  启动应用: docker-compose -f $COMPOSE_FILE start"
    echo "  重启应用: docker-compose -f $COMPOSE_FILE restart"
    echo "  回滚版本: bash deploy.sh --rollback"
    print_separator
}

# 运行主函数
main "$@"
