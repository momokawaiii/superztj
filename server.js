const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Database = require('./src/database/database');
const authRoutes = require('./src/routes/auth');
const materialRoutes = require('./src/routes/materials');
const enhancedMaterialRoutes = require('./src/routes/enhancedMaterials');
const quizRoutes = require('./src/routes/quiz');
const optimizedQuizRoutes = require('./src/routes/optimizedQuiz');
const analysisRoutes = require('./src/routes/analysis');
const aiRoutes = require('./src/routes/ai');

// 导入安全工具
const SecurityUtils = require('./src/utils/security');

const app = express();

// 加载环境变量
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 文件上传配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const secureFilename = SecurityUtils.generateSecureFilename(file.originalname);
    cb(null, secureFilename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB限制
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|ppt|pptx|txt/;
    const allowedMimeTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];
    
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'));
    }
  }
});

// 初始化数据库
Database.init();

// 路由配置
app.use('/api/auth', authRoutes);
app.use('/api/materials', upload.single('file'), materialRoutes);
app.use('/api/materials', upload.single('file'), enhancedMaterialRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/quiz-optimized', optimizedQuizRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/ai', aiRoutes);

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({ 
    success: false, 
    message: error.message || '服务器内部错误' 
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: '请求的资源不存在' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 超级做题家服务器运行在 http://localhost:${PORT}`);
  console.log(`📚 开始您的智能学习之旅！`);
});

module.exports = app;