@echo off
chcp 65001 >nul

echo.
echo 🍜 中华美食外卖系统 - Firebase集成版
echo ======================================

REM 检查环境变量文件
if not exist .env (
    echo ⚠️  未找到 .env 文件
    echo 📋 请先复制环境变量示例文件：
    echo    copy .env.example .env
    echo 🔧 然后编辑 .env 文件，填入你的Firebase配置信息
    echo.
    echo 📖 Firebase配置获取方法：
    echo    1. 访问 https://console.firebase.google.com/
    echo    2. 创建新项目或选择现有项目
    echo    3. 启用 Firestore Database
    echo    4. 在项目设置中获取网络应用配置
    echo    5. 将配置值填入 .env 文件
    pause
    exit /b 1
)

echo ✅ 发现 .env 配置文件

REM 检查 Node.js 版本
echo 🔍 检查 Node.js 版本...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未安装 Node.js，请先安装 Node.js
    echo 📥 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%

REM 检查 npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未安装 npm，请先安装 npm
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm 版本: %NPM_VERSION%

REM 安装依赖
echo.
echo 📦 安装项目依赖...
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已存在，跳过安装
)

REM 检查 Firebase 配置
echo.
echo 🔧 检查 Firebase 配置...
findstr "your-firebase-api-key" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  检测到默认配置值，请确保已填入真实的Firebase配置
    echo 📖 如需帮助，请查看 README-Firebase.md 文件
)

REM 启动应用
echo.
echo 🚀 启动应用...
echo 📱 应用将在 http://localhost:3000 运行
echo 🛑 按 Ctrl+C 停止应用
echo.

REM 设置Node.js选项并启动开发服务器
set NODE_OPTIONS=--openssl-legacy-provider
call npm start

pause