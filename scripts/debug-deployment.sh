#!/bin/bash

# ==============================
# 部署故障快速排查脚本
# ==============================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}部署故障快速排查${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""

# 1. 检查容器状态
log_info "检查容器状态..."
docker-compose ps
echo ""

# 2. 检查后端容器日志
log_info "后端容器日志（最近 50 行）："
docker-compose logs --tail=50 server
echo ""

# 3. 检查前端容器日志
log_info "前端容器日志（最近 50 行）："
docker-compose logs --tail=50 frontend
echo ""

# 4. 检查端口占用
log_info "检查端口占用情况..."
echo "3001 端口："
lsof -i :3001 || netstat -tuln | grep 3001
echo "4000 端口："
lsof -i :4000 || netstat -tuln | grep 4000
echo ""

# 5. 检查磁盘空间
log_info "检查磁盘空间..."
df -h /
echo ""

# 6. 检查 Docker 资源
log_info "检查 Docker 资源..."
docker system df
echo ""

# 7. 检查环境变量
log_info "检查环境变量配置..."
if [ -f .env ]; then
    log_success ".env 文件存在"
    echo "配置内容（隐藏敏感信息）："
    cat .env | grep -v "SECRET\|KEY" | grep -v "^#" | grep -v "^$"
else
    log_error ".env 文件不存在"
fi
echo ""

# 8. 检查数据卷
log_info "检查数据卷..."
docker volume ls | grep lingqi
echo ""

# 9. 检查网络
log_info "检查 Docker 网络..."
docker network ls | grep lingqi
echo ""

# 10. 尝试手动健康检查
log_info "尝试访问健康检查端点..."
SERVER_RUNNING=$(docker ps -q -f name=lingqi-server)
if [ ! -z "$SERVER_RUNNING" ]; then
    echo "后端容器正在运行，尝试健康检查："
    docker exec lingqi-server curl -f http://localhost:3001/health 2>/dev/null || echo "健康检查失败"
else
    log_warning "后端容器未运行"
fi
echo ""

echo -e "${BLUE}===========================================${NC}"
echo -e "${YELLOW}建议操作：${NC}"
echo ""
echo "1. 如果是数据库问题："
echo "   docker-compose down"
echo "   docker volume rm lingqi_server-data"
echo "   docker-compose up -d"
echo ""
echo "2. 如果是端口冲突："
echo "   修改 .env 文件中的端口配置"
echo ""
echo "3. 如果是镜像问题："
echo "   docker-compose down"
echo "   docker system prune -a"
echo "   bash deploy.sh"
echo ""
echo "4. 查看实时日志："
echo "   docker-compose logs -f server"
echo ""
echo -e "${BLUE}===========================================${NC}"
