@echo off
echo ========================================
echo    超级做题家 - AI学习辅助工具
echo ========================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到Node.js，请先安装Node.js
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js环境检查通过！
echo.

echo 正在检查项目依赖...
if not exist "node_modules" (
    echo 首次运行，正在安装依赖包...
    npm install
    if %errorlevel% neq 0 (
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
    echo 依赖安装完成！
)

echo.
echo 正在创建必要的目录...
if not exist "uploads" mkdir uploads
if not exist "data" mkdir data
if not exist "logs" mkdir logs

echo.
echo 正在启动服务器...
echo 访问地址：http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo.

npm start

pause