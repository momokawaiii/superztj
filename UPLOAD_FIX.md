# 文件上传功能修复说明

## 问题诊断

上传材料功能可能存在以下问题：

1. **前端事件绑定缺失** - 文件选择事件未正确绑定
2. **后端路由问题** - 服务器端处理异常
3. **文件路径配置** - uploads目录权限或路径问题
4. **JavaScript错误** - 控制台可能有未捕获的错误

## 已修复的问题

### 1. 添加文件选择事件监听器
```javascript
// 在setupFileUpload()函数中添加了缺失的事件监听器
fileInput.addEventListener('change', handleFileSelect);
```

### 2. 增强错误处理和调试信息
```javascript
// 添加了详细的控制台日志
console.log('开始处理文件上传:', files.length, '个文件');
console.log('发送上传请求到:', '/api/materials/upload');
console.log('上传响应状态:', response.status, response.statusText);
```

### 3. 改进错误提示
- 添加了更详细的错误信息
- 改进了进度条显示逻辑
- 增加了元素存在性检查

## 测试步骤

### 1. 检查控制台日志
1. 打开浏览器开发者工具 (F12)
2. 切换到Console标签
3. 刷新页面，查看是否有错误信息
4. 应该看到："文件上传功能初始化完成"

### 2. 测试文件选择
1. 点击"上传材料"标签
2. 点击上传区域或"选择文件"按钮
3. 选择一个测试文件（PDF、Word、图片等）
4. 观察控制台日志和上传进度

### 3. 测试拖拽上传
1. 从文件管理器拖拽文件到上传区域
2. 观察上传区域样式变化（应该有拖拽效果）
3. 释放文件，观察上传过程

## 常见问题排查

### 问题1: 点击上传区域无反应
**可能原因**: JavaScript事件未绑定
**解决方案**: 
```javascript
// 在浏览器控制台执行以下代码测试
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
console.log('uploadZone:', uploadZone);
console.log('fileInput:', fileInput);

// 如果元素存在，手动绑定事件
if (uploadZone && fileInput) {
    uploadZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => console.log('文件选择:', e.target.files);
}
```

### 问题2: 文件上传到服务器失败
**可能原因**: 
- uploads目录不存在或无权限
- 服务器端multer配置问题
- 文件大小超限

**解决方案**:
1. 检查项目根目录是否有uploads文件夹
2. 确保uploads文件夹有写入权限
3. 检查文件大小（当前限制50MB）

### 问题3: 数据库保存失败
**可能原因**: 
- 数据库文件不存在
- 表结构问题
- 字段约束冲突

**解决方案**:
```bash
# 重新初始化数据库
rm -rf data/
npm run setup
# 或者
node setup.js
```

## 手动测试代码

如果自动上传仍有问题，可以在浏览器控制台执行以下代码进行测试：

### 测试1: 检查元素
```javascript
// 检查关键元素是否存在
const elements = {
    uploadZone: document.getElementById('uploadZone'),
    fileInput: document.getElementById('fileInput'),
    uploadProgress: document.getElementById('uploadProgress'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText')
};

console.log('页面元素检查:', elements);
Object.entries(elements).forEach(([name, element]) => {
    console.log(`${name}:`, element ? '✓ 存在' : '✗ 缺失');
});
```

### 测试2: 手动触发文件选择
```javascript
// 手动触发文件选择对话框
const fileInput = document.getElementById('fileInput');
if (fileInput) {
    fileInput.click();
    console.log('文件选择对话框已打开');
} else {
    console.error('fileInput元素未找到');
}
```

### 测试3: 模拟文件上传
```javascript
// 创建测试文件并上传
const testFile = new File(['测试内容'], 'test.txt', { type: 'text/plain' });
const formData = new FormData();
formData.append('file', testFile);

fetch('/api/materials/upload', {
    method: 'POST',
    body: formData
})
.then(response => {
    console.log('上传响应:', response.status, response.statusText);
    return response.json();
})
.then(data => {
    console.log('上传结果:', data);
})
.catch(error => {
    console.error('上传错误:', error);
});
```

## 服务器端检查

### 1. 检查uploads目录
```bash
# 确保uploads目录存在且有正确权限
mkdir -p uploads
chmod 755 uploads
ls -la uploads/
```

### 2. 检查服务器日志
启动服务器时观察控制台输出，查看是否有错误信息：
```bash
npm start
# 或
node server.js
```

### 3. 测试API端点
```bash
# 使用curl测试上传API
curl -X POST -F "file=@test.txt" http://localhost:3000/api/materials/upload
```

## 备用解决方案

如果上述修复仍不能解决问题，可以使用以下备用方案：

### 方案1: 简化上传逻辑
创建一个最简单的上传测试页面：

```html
<!-- 添加到index.html的上传区域 -->
<div style="margin: 20px 0; padding: 20px; border: 1px solid #ccc;">
    <h4>备用上传测试</h4>
    <input type="file" id="testFileInput" accept=".pdf,.doc,.docx,.txt">
    <button onclick="testUpload()">测试上传</button>
    <div id="testResult"></div>
</div>

<script>
function testUpload() {
    const fileInput = document.getElementById('testFileInput');
    const resultDiv = document.getElementById('testResult');
    
    if (!fileInput.files.length) {
        resultDiv.innerHTML = '<p style="color: red;">请先选择文件</p>';
        return;
    }
    
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    resultDiv.innerHTML = '<p>上传中...</p>';
    
    fetch('/api/materials/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        resultDiv.innerHTML = `<p style="color: green;">上传成功: ${JSON.stringify(data)}</p>`;
    })
    .catch(error => {
        resultDiv.innerHTML = `<p style="color: red;">上传失败: ${error.message}</p>`;
    });
}
</script>
```

### 方案2: 重置上传功能
如果问题持续存在，可以重新初始化上传功能：

```javascript
// 在浏览器控制台执行
function resetUploadFunction() {
    // 移除现有事件监听器
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadZone && fileInput) {
        // 克隆元素以移除所有事件监听器
        const newUploadZone = uploadZone.cloneNode(true);
        const newFileInput = fileInput.cloneNode(true);
        
        uploadZone.parentNode.replaceChild(newUploadZone, uploadZone);
        fileInput.parentNode.replaceChild(newFileInput, fileInput);
        
        // 重新绑定事件
        newUploadZone.onclick = () => newFileInput.click();
        newFileInput.onchange = (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files);
            }
        };
        
        console.log('上传功能已重置');
    }
}

// 执行重置
resetUploadFunction();
```

## 验证修复成功

修复完成后，应该能够：

1. ✅ 点击上传区域打开文件选择对话框
2. ✅ 拖拽文件到上传区域
3. ✅ 看到上传进度条
4. ✅ 收到上传成功/失败的提示
5. ✅ 在材料列表中看到上传的文件
6. ✅ 控制台有详细的调试信息

---

**如果问题仍然存在，请提供浏览器控制台的错误信息以便进一步诊断。**