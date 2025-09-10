# 🚀 Ollama 集成设置指南

## ✅ 问题已解决

### 原始问题
```
Ollama服务检查失败: connect ECONNREFUSED ::1:11434
⚠️  Ollama服务不可用，使用备用模式
❌ 错误: connect ECONNREFUSED ::1:11434
```

### 解决方案
**问题原因**: Windows 系统将 `localhost` 解析为 IPv6 地址 `::1`，但 Ollama 服务只监听 IPv4 地址 `127.0.0.1`。

**修复内容**:
1. ✅ 修改 `src/services/ollamaService.js` 中的默认 URL
2. ✅ 更新 `.env` 和 `.env.example` 配置文件
3. ✅ 创建连接诊断工具

## 🔧 修复详情

### 1. 服务配置修复
```javascript
// 修改前
this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

// 修改后  
this.baseURL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
```

### 2. 环境变量更新
```bash
# .env 文件
USE_OLLAMA=true
# 使用 127.0.0.1 而不是 localhost 避免 IPv6 解析问题
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_TIMEOUT=30000
```

## 🎯 验证步骤

### 1. 检查 Ollama 服务状态
```bash
# 检查进程
tasklist | findstr ollama

# 检查端口
netstat -an | findstr 11434
```

### 2. 测试连接
```bash
# 运行诊断工具
node test-ollama-connection.js

# 快速连接测试
curl http://127.0.0.1:11434/api/tags
```

### 3. 验证模型
```bash
# 查看已安装模型
ollama list

# 测试模型生成
ollama run qwen2.5:7b "你好"
```

## 🚀 启动应用

### 1. 确保 Ollama 运行
```bash
# 启动 Ollama 服务（如果未运行）
ollama serve
```

### 2. 启动应用服务器
```bash
# 进入项目目录
cd superztj

# 安装依赖（如果需要）
npm install

# 启动应用
npm start
# 或
node server.js
```

### 3. 验证 AI 功能
```bash
# 测试 AI 生成功能
node test-ai-generation.js
```

## 📊 当前状态

✅ **Ollama 服务**: 正在运行 (127.0.0.1:11434)  
✅ **模型状态**: qwen2.5:7b (4.4GB) 已安装  
✅ **连接测试**: 通过  
✅ **配置修复**: 完成  

## 🎮 使用流程

1. **上传学习材料** - 支持 TXT、PDF、DOC 等格式
2. **生成个性化题目** - AI 根据材料内容智能出题
3. **开始练习** - 多种题型：选择题、填空题、问答题
4. **获得反馈** - 智能评分和详细解析

## 🔍 故障排除

### 如果仍然出现连接问题：

1. **重启 Ollama 服务**
   ```bash
   # 停止服务
   taskkill /f /im ollama.exe
   
   # 重新启动
   ollama serve
   ```

2. **检查防火墙设置**
   - 确保端口 11434 未被阻止
   - 允许 ollama.exe 通过防火墙

3. **验证模型完整性**
   ```bash
   # 重新下载模型（如果需要）
   ollama pull qwen2.5:7b
   ```

4. **查看详细日志**
   ```bash
   # 启动时查看控制台输出
   node server.js
   ```

## 📈 性能优化建议

1. **首次使用**: 模型加载需要 10-30 秒，请耐心等待
2. **内存要求**: 建议至少 8GB RAM 用于 qwen2.5:7b 模型
3. **并发限制**: 同时最多处理 3-5 个 AI 请求
4. **预热模型**: 应用启动后可运行一次测试请求来预热模型

## 🎉 成功标志

当你看到以下输出时，表示一切正常：
```
✅ Ollama AI服务初始化完成
📋 可用模型: qwen2.5:7b
🎯 当前模型: qwen2.5:7b
```

现在你可以享受真正的 AI 智能出题功能了！🚀