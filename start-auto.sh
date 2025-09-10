#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo
echo "========================================"
echo "   超级做题家 - AI学习辅助工具"
echo "   自动环境配置和启动"
echo "========================================"
echo

echo -e "${BLUE}🚀 正在进行自动环境检测和配置...${NC}"
echo

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误：请在项目根目录运行此脚本${NC}"
    echo "当前目录：$(pwd)"
    echo
    exit 1
fi

# 运行自动配置脚本
node setup.js

if [ $? -ne 0 ]; then
    echo
    echo -e "${RED}❌ 自动配置失败，请检查上述错误信息${NC}"
    echo
    exit 1
fi

echo
echo -e "${GREEN}✅ 配置完成，正在启动应用...${NC}"
echo

# 启动应用
npm start

echo
echo "应用已停止运行"