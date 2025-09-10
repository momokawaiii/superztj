<<<<<<< HEAD
# superztj
codebuddy contest
=======
# 超级做题家 - AI学习辅助工具 (本地Demo版)

🚀 一个基于本地LLM的智能学习辅助平台，专为本地测试和演示设计。无需注册登录，开箱即用！

## ✨ 功能特色

### 🧠 智能题目生成
- 支持上传PPT、PDF、Word、图片等多种格式的学习材料
- AI自动分析材料内容，生成个性化练习题目
- 支持填空题、选择题、问答题、模拟试卷等多种题型
- 根据难度等级智能调整题目复杂度

### 🤖 自动批改与讲解
- AI自动批改答题结果，提供即时反馈
- 详细的解题思路和知识点讲解
- 针对错误答案提供改进建议
- 支持主观题的智能评分

### 📊 学习数据分析
- 实时学习进度跟踪和可视化图表
- 知识点掌握情况分析
- 错题统计和薄弱环节识别
- 个性化学习建议和计划

### 🎯 错题强化练习
- 智能错题收集和分类管理
- 针对性错题重练功能
- 错题掌握程度跟踪
- 薄弱知识点强化训练

## 🛠️ 技术架构

### 前端技术
- **HTML5 + CSS3 + JavaScript**: 现代化响应式界面
- **Chart.js**: 数据可视化图表
- **Font Awesome**: 图标库
- **Animate.css**: 动画效果

### 后端技术
- **Node.js + Express**: 服务器框架
- **SQLite3**: 轻量级数据库
- **Multer**: 文件上传处理
- **PDF-Parse**: PDF文档解析
- **Mammoth**: Word文档解析
- **Node-NLP**: 自然语言处理

### AI服务
- **本地LLM集成**: 支持接入各种本地大语言模型
- **智能内容分析**: 关键词提取和概念识别
- **题目生成算法**: 多种题型的智能生成
- **自动评分系统**: 客观题和主观题评分

## 📦 安装部署

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器
- 至少 2GB 可用内存
- 支持的操作系统：Windows、macOS、Linux

### 快速开始

#### 方法1: 一键启动（推荐）
```bash
# Windows用户
双击运行 start-auto.bat

# Linux/macOS用户
chmod +x start-auto.sh
./start-auto.sh
```

#### 方法2: 手动启动
```bash
# 1. 安装依赖
npm install

# 2. 启动应用
npm start
```

#### 访问应用
- 本地访问：http://localhost:3000
- 局域网访问：http://你的IP地址:3000

> 💡 **本地Demo特性**: 无需注册登录，直接使用所有功能！

### 配置说明

#### 环境变量配置
创建 `.env` 文件并配置以下参数：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# JWT密钥
JWT_SECRET=your-super-secret-key

# 数据库配置
DB_PATH=./data/study_helper.db

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=50MB

# AI服务配置
AI_MODEL_PATH=./models/your-llm-model
AI_API_ENDPOINT=http://localhost:8080/api/generate
```

#### 本地LLM集成
支持集成以下本地LLM模型：
- **Ollama**: 轻量级本地LLM运行环境
- **LM Studio**: 图形化LLM管理工具
- **GPT4All**: 开源本地GPT模型
- **ChatGLM**: 清华大学开源对话模型

配置示例（以Ollama为例）：
```javascript
// 在 src/services/aiService.js 中配置
const AI_CONFIG = {
    provider: 'ollama',
    model: 'llama2:7b',
    endpoint: 'http://localhost:11434/api/generate',
    temperature: 0.7,
    max_tokens: 2048
};
```

## 📖 使用指南

### 1. 上传学习材料
- 支持拖拽上传或点击选择文件
- 支持的格式：PDF、DOC/DOCX、PPT/PPTX、TXT、JPG/PNG
- 文件大小限制：50MB
- 上传后AI会自动分析内容并提取关键信息

### 2. 开始练习
- **填空练习**：基于材料内容生成填空题，巩固关键知识点
- **选择题练习**：多选题和单选题，快速检验理解程度
- **问答题练习**：开放性问题，训练深度理解和表达能力
- **模拟考试**：综合性试卷，全面检测学习效果

### 3. 查看分析报告
- **学习统计**：练习次数、平均分数、学习时长等
- **进度趋势**：学习效果的时间变化曲线
- **知识点分析**：各科目和知识点的掌握情况
- **错题分析**：错题分布和改进建议

### 4. 错题强化
- 自动收集练习中的错题
- 按知识点和难度分类管理
- 支持重复练习直到掌握
- 提供针对性的学习建议

## 🔧 开发指南

### 项目结构
```
super-study-helper/
├── public/                 # 前端静态文件
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript文件
│   └── index.html         # 主页面
├── src/                   # 后端源码
│   ├── database/          # 数据库模块
│   ├── routes/            # API路由
│   ├── services/          # 业务服务
│   └── utils/             # 工具函数
├── uploads/               # 文件上传目录
├── data/                  # 数据库文件
├── package.json           # 项目配置
├── server.js              # 服务器入口
└── README.md              # 项目文档
```

### API接口文档

#### 用户认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

#### 材料管理
- `POST /api/materials/upload` - 上传学习材料
- `GET /api/materials/list` - 获取材料列表
- `GET /api/materials/:id` - 获取材料详情
- `DELETE /api/materials/:id` - 删除材料

#### 练习功能
- `POST /api/quiz/generate/:materialId` - 生成题目
- `POST /api/quiz/start` - 开始练习
- `POST /api/quiz/answer` - 提交答案
- `POST /api/quiz/complete/:sessionId` - 完成练习
- `GET /api/quiz/history` - 获取练习历史
- `GET /api/quiz/wrong-questions` - 获取错题列表

#### 数据分析
- `GET /api/analysis/stats` - 获取学习统计
- `GET /api/analysis/progress` - 获取学习进度
- `GET /api/analysis/wrong-analysis` - 获取错题分析
- `GET /api/analysis/recommendations` - 获取学习建议

### 数据库设计

#### 主要数据表
- **users**: 用户信息表
- **materials**: 学习材料表
- **questions**: 题目表
- **quiz_sessions**: 练习会话表
- **answer_records**: 答题记录表
- **wrong_questions**: 错题本表
- **study_stats**: 学习统计表

### 自定义开发

#### 添加新的题目类型
1. 在 `src/services/aiService.js` 中添加生成逻辑
2. 在前端 `public/js/app.js` 中添加渲染逻辑
3. 更新数据库表结构（如需要）

#### 集成新的LLM模型
1. 在 `src/services/aiService.js` 中添加模型适配器
2. 配置模型参数和API接口
3. 测试题目生成质量

## 🚀 部署上线

### Docker部署
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### PM2部署
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name "super-study-helper"

# 设置开机自启
pm2 startup
pm2 save
```

### Nginx反向代理
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

### 开发流程
1. Fork 项目到你的GitHub账户
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建Pull Request

### 代码规范
- 使用ESLint进行代码检查
- 遵循JavaScript Standard Style
- 添加适当的注释和文档
- 编写单元测试

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目的支持：
- [Node.js](https://nodejs.org/) - JavaScript运行环境
- [Express](https://expressjs.com/) - Web应用框架
- [SQLite](https://www.sqlite.org/) - 轻量级数据库
- [Chart.js](https://www.chartjs.org/) - 图表库
- [Font Awesome](https://fontawesome.com/) - 图标库

## 📞 联系我们

- 项目主页：[GitHub Repository]
- 问题反馈：[GitHub Issues]
- 邮箱：support@super-study-helper.com

---

**超级做题家** - 让AI助力你的学习之旅！ 🎓✨
>>>>>>> 2d0a089 (首次提交：添加本地项目文件)
