#!/bin/bash

echo "========================================"
echo "   超级做题家 - AI学习辅助工具"
echo "========================================"
echo

# 检查Node.js环境
echo "正在检查Node.js环境..."
if ! command -v node &> /dev/null; then
    echo "错误：未找到Node.js，请先安装Node.js"
    echo "Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "CentOS/RHEL: sudo yum install nodejs npm"
    echo "macOS: brew install node"
    exit 1
fi

echo "Node.js环境检查通过！"
echo "Node.js版本: $(node --version)"
echo "npm版本: $(npm --version)"
echo

# 检查项目依赖
echo "正在检查项目依赖..."
if [ ! -d "node_modules" ]; then
    echo "首次运行，正在安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "依赖安装失败，请检查网络连接"
        exit 1
    fi
    echo "依赖安装完成！"
fi

echo
echo "正在创建必要的目录..."
mkdir -p uploads data logs

echo
echo "正在启动服务器..."
echo "访问地址：http://localhost:3000"
echo "按 Ctrl+C 停止服务器"
echo

# 启动应用
npm start