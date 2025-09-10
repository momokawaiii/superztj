# 安装指南

## 环境准备

### 1. 安装 Node.js

#### Windows 系统
1. 访问 [Node.js官网](https://nodejs.org/)
2. 下载 LTS 版本（推荐 18.x 或 20.x）
3. 运行安装程序，按默认设置安装
4. 安装完成后，重新打开命令提示符或PowerShell
5. 验证安装：
   ```cmd
   node --version
   npm --version
   ```

#### macOS 系统
使用 Homebrew 安装：
```bash
# 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node

# 验证安装
node --version
npm --version
```

#### Linux 系统
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node --version
npm --version
```

### 2. 安装项目依赖

在项目根目录执行：
```bash
npm install
```

如果遇到网络问题，可以使用国内镜像：
```bash
npm install --registry https://registry.npmmirror.com
```

### 3. 启动应用

#### 开发模式
```bash
npm run dev
```

#### 生产模式
```bash
npm start
```

#### 使用启动脚本
- Windows: 双击 `start.bat`
- Linux/macOS: 执行 `chmod +x start.sh && ./start.sh`

### 4. 访问应用

打开浏览器访问：http://localhost:3000

## 常见问题

### Q: npm 命令不存在
A: 请确保已正确安装 Node.js，并重新打开命令行窗口。

### Q: 端口被占用
A: 修改 `.env` 文件中的 `PORT` 配置，或停止占用3000端口的其他程序。

### Q: 依赖安装失败
A: 尝试清除缓存后重新安装：
```bash
npm cache clean --force
npm install
```

### Q: 文件上传失败
A: 检查 `uploads` 目录是否存在且有写入权限。

## 本地LLM集成

### 推荐的本地LLM方案

#### 1. Ollama（推荐）
```bash
# 安装 Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 下载模型
ollama pull llama2:7b

# 启动服务
ollama serve
```

#### 2. LM Studio
1. 下载 [LM Studio](https://lmstudio.ai/)
2. 安装并启动应用
3. 下载适合的模型（如 Llama 2 7B）
4. 启动本地服务器

#### 3. GPT4All
1. 下载 [GPT4All](https://gpt4all.io/)
2. 安装并下载模型
3. 配置API接口

### 配置AI服务

在 `.env` 文件中配置：
```env
AI_API_ENDPOINT=http://localhost:11434/api/generate
AI_MODEL_NAME=llama2:7b
```

## 数据库初始化

首次启动时，应用会自动创建SQLite数据库和必要的表结构。

如需重置数据库，删除 `data/study_helper.db` 文件即可。

## 生产环境部署

### 使用PM2
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name "super-study-helper"

# 设置开机自启
pm2 startup
pm2 save
```

### 使用Docker
```bash
# 构建镜像
docker build -t super-study-helper .

# 运行容器
docker run -d -p 3000:3000 --name study-helper super-study-helper
```

## 性能优化建议

1. **内存配置**: 建议至少2GB可用内存
2. **存储空间**: 预留至少5GB用于文件上传和数据库
3. **网络**: 确保良好的网络连接用于AI模型下载
4. **CPU**: 多核CPU有助于提升AI处理速度

## 技术支持

如遇到安装问题，请：
1. 查看项目的 [GitHub Issues](https://github.com/your-repo/issues)
2. 提交新的Issue描述问题
3. 联系技术支持邮箱