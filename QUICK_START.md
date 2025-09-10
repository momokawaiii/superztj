# 🚀 快速启动指南

## 一键启动（推荐）

### Windows用户
1. 双击运行 `start-auto.bat`
2. 等待自动配置完成
3. 浏览器访问 http://localhost:3000

### Linux/macOS用户
```bash
chmod +x start-auto.sh
./start-auto.sh
```

## 手动启动
```bash
# 1. 自动环境配置
npm run setup

# 2. 启动应用
npm start
```

## 功能特色
- 📚 **智能材料分析**: 上传PDF、Word、PPT等文件，AI自动提取关键内容
- 🧠 **题目自动生成**: 根据材料内容生成填空题、选择题、问答题
- 🤖 **智能批改**: AI自动批改答题，提供详细解析和改进建议
- 📊 **学习分析**: 实时跟踪学习进度，分析薄弱环节
- 🎯 **错题强化**: 智能收集错题，针对性重复练习

## 支持的文件格式
- 📄 PDF文档
- 📝 Word文档 (.doc, .docx)
- 📊 PowerPoint演示文稿 (.ppt, .pptx)
- 🖼️ 图片文件 (.jpg, .png, .gif)
- 📋 文本文件 (.txt)

## AI服务配置（可选）
为了使用完整的AI功能，建议配置本地LLM服务：

### 推荐：Ollama
```bash
# 安装Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 下载模型
ollama pull llama2:7b

# 启动服务
ollama serve
```

### 其他选择
- **LM Studio**: https://lmstudio.ai/
- **GPT4All**: https://gpt4all.io/

## 常见问题

### Q: 端口被占用怎么办？
A: 自动配置脚本会检测端口冲突并自动分配可用端口。

### Q: 依赖安装失败？
A: 脚本会自动尝试使用国内镜像，如仍失败请检查网络连接。

### Q: 没有AI功能？
A: 基础功能无需AI服务即可使用，AI功能需要配置本地LLM。

### Q: 文件上传失败？
A: 检查文件格式是否支持，单个文件不超过50MB。

## 技术支持
- 📖 详细文档：查看 `README.md`
- 🔧 安装指南：查看 `INSTALL.md`
- 🐛 问题反馈：提交GitHub Issue

---
**超级做题家** - 让AI助力你的学习之旅！ 🎓✨