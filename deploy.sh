#!/bin/bash

# 灵棋经占卜应用一键部署脚本
# 使用方法: bash deploy.sh

set -e

echo "=========================================="
echo "灵棋经占卜应用 - 一键部署脚本"
echo "=========================================="

# 配置变量
PROJECT_DIR="/opt/lingqi"
CONTAINER_NAME="lingqi-app"
IMAGE_NAME="lingqi-frontend"
PORT="4000"

# 检查是否在正确的目录
if [ ! -d "$PROJECT_DIR" ]; then
    echo "错误: 项目目录 $PROJECT_DIR 不存在"
    exit 1
fi

cd $PROJECT_DIR

echo ""
echo "步骤 1/5: 拉取最新代码..."
git pull origin main

echo ""
echo "步骤 2/5: 停止并删除旧容器..."
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
    echo "旧容器已删除"
else
    echo "没有找到旧容器"
fi

echo ""
echo "步骤 3/5: 删除旧镜像..."
if [ "$(docker images -q $IMAGE_NAME)" ]; then
    docker rmi $IMAGE_NAME || true
    echo "旧镜像已删除"
else
    echo "没有找到旧镜像"
fi

echo ""
echo "步骤 4/5: 构建新镜像..."
docker build -t $IMAGE_NAME .

echo ""
echo "步骤 5/5: 启动新容器..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:80 \
    --restart unless-stopped \
    $IMAGE_NAME

echo ""
echo "=========================================="
echo "部署完成！"
echo "应用已启动在端口: $PORT"
echo "访问地址: http://your-server-ip:$PORT"
echo "=========================================="
echo ""
echo "常用命令:"
echo "  查看日志: docker logs -f $CONTAINER_NAME"
echo "  停止应用: docker stop $CONTAINER_NAME"
echo "  启动应用: docker start $CONTAINER_NAME"
echo "  重启应用: docker restart $CONTAINER_NAME"
echo "=========================================="
