@echo off
chcp 65001 >nul
title 超级做题家 - AI学习辅助工具

echo.
echo ========================================
echo    超级做题家 - AI学习辅助工具
echo    自动环境配置和启动
echo ========================================
echo.

echo 🚀 正在进行自动环境检测和配置...
echo.

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误：请在项目根目录运行此脚本
    echo 当前目录：%CD%
    echo.
    pause
    exit /b 1
)

REM 运行自动配置脚本
node setup.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ 自动配置失败，请检查上述错误信息
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ 配置完成，正在启动应用...
echo.

REM 启动应用
npm start

echo.
echo 应用已停止运行
pause