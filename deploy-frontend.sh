#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# 定义变量
REPO_URL="https://github.com/wxq2385209181/cursor-Demo.git"
BRANCH="test"
DEPLOY_PATH="/home/work_space"
DIST_PATH="/home/work_space"
PROJECT_NAME="cursor-Demo"

# 日志函数
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# 检查git命令
if ! command -v git &> /dev/null; then
    log "Git未安装，正在安装..."
    yum install -y git || apt-get install -y git
fi

# 确保部署目录存在
mkdir -p $DEPLOY_PATH
cd $DEPLOY_PATH

# 如果项目目录已存在
if [ -d "$PROJECT_NAME" ]; then
    log "项目目录已存在，更新代码..."
    cd $PROJECT_NAME
    # 清理本地修改
    git reset --hard
    git clean -fd
    # 拉取最新代码
    if ! git pull origin $BRANCH; then
        error "拉取代码失败，请检查网络和权限"
        exit 1
    fi
else
    log "克隆新项目..."
    if ! git clone $REPO_URL; then
        error "克隆失败，请检查仓库地址和权限"
        exit 1
    fi
    cd $PROJECT_NAME
    git checkout $BRANCH
fi

# 安装依赖
log "安装依赖..."
npm install

# 打包
log "开始打包..."
npm run build:test

# 部署到目标目录
log "部署到目标目录..."
if [ -d "dist" ]; then
    # 备份当前版本
    if [ -d "$DIST_PATH/dist" ]; then
        mv "$DIST_PATH/dist" "${DIST_PATH}/dist_backup_$(date +%Y%m%d_%H%M%S)"
    fi
    
    # 复制新的构建文件
    cp -r dist $DIST_PATH/
    
    log "部署完成!"
else
    error "打包目录不存在，部署失败!"
    exit 1
fi 