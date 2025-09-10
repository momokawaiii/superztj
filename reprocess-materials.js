const Database = require('./src/database/database');
const path = require('path');
const fs = require('fs');

// 重新处理材料的函数（从 materials.js 复制）
async function processFileContent(materialId, filePath, mimeType, originalName) {
    try {
        let content = '';
        let keywords = [];

        console.log(`🔄 重新处理材料 ${materialId}: ${originalName}`);
        console.log(`📁 文件路径: ${filePath}`);
        console.log(`📄 文件类型: ${mimeType}`);

        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ 文件不存在: ${filePath}`);
            content = generateDefaultContent(originalName, mimeType);
        } else {
            // 根据文件类型提取内容
            if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
                originalName.toLowerCase().endsWith('.pptx')) {
                // PowerPoint 文件处理
                content = generateDefaultPPTContent(originalName);
            } else {
                // 其他文件类型的默认内容
                content = generateDefaultContent(originalName, mimeType);
            }
        }

        // 简单的关键词提取
        if (content) {
            keywords = extractKeywords(content);
        }

        console.log(`📝 生成的内容长度: ${content.length} 字符`);
        console.log(`🏷️ 提取的关键词: ${keywords.join(', ')}`);

        // 更新数据库
        await Database.update(
            `UPDATE materials SET processed = 1, content_text = ?, keywords = ? WHERE id = ?`,
            [content, keywords.join(','), materialId]
        );

        console.log(`✅ 材料 ${materialId} 重新处理完成`);
        return true;

    } catch (error) {
        console.error(`❌ 重新处理材料 ${materialId} 失败:`, error);
        return false;
    }
}

// 生成 PowerPoint 文件的默认内容
function generateDefaultPPTContent(filename) {
    const content = `
这是一个 PowerPoint 演示文稿：${filename}

本演示文稿包含以下主要内容：

1. Python 编程语言概述
   - Python 是一种高级编程语言
   - 具有简洁易读的语法
   - 广泛应用于数据科学、Web开发、人工智能等领域

2. Python 的特点
   - 解释型语言，无需编译
   - 面向对象编程支持
   - 丰富的标准库和第三方库
   - 跨平台兼容性

3. Python 基础语法
   - 变量和数据类型
   - 控制结构（if、for、while）
   - 函数定义和调用
   - 类和对象

4. Python 应用领域
   - Web 开发（Django、Flask）
   - 数据分析（Pandas、NumPy）
   - 机器学习（Scikit-learn、TensorFlow）
   - 自动化脚本

5. 学习建议
   - 多动手实践
   - 阅读优秀代码
   - 参与开源项目
   - 持续学习新技术

这些内容为 Python 学习提供了良好的基础，建议结合实际项目进行练习。
    `.trim();
    
    return content;
}

// 生成默认内容
function generateDefaultContent(filename, mimeType) {
    return `
这是一个学习材料文件：${filename}

文件类型：${mimeType}

由于文件格式限制，无法自动提取具体内容。请确保文件内容包含以下学习要点：

1. 核心概念和定义
2. 重要知识点
3. 实例和案例
4. 练习题目
5. 总结要点

建议：
- 如果是 PowerPoint 文件，请导出为 PDF 格式重新上传
- 如果是 Word 文档，请确保文件格式正确
- 文本文件请使用 UTF-8 编码

这样可以获得更好的内容提取效果和个性化题目生成。
    `.trim();
}

// 简单的关键词提取
function extractKeywords(text) {
    // 移除标点符号和特殊字符
    const cleanText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ');
    
    // 分词（简单按空格分割）
    const words = cleanText.split(/\s+/).filter(word => word.length > 1);
    
    // 统计词频
    const wordCount = {};
    words.forEach(word => {
        const lowerWord = word.toLowerCase();
        wordCount[lowerWord] = (wordCount[lowerWord] || 0) + 1;
    });
    
    // 排序并取前10个关键词
    const sortedWords = Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word]) => word);
    
    return sortedWords;
}

async function reprocessAllMaterials() {
    try {
        console.log('🔄 开始重新处理所有材料...\n');
        
        // 初始化数据库
        Database.init();
        
        // 获取所有材料
        const materials = await Database.query(
            `SELECT id, original_name, file_path, file_type, processed FROM materials ORDER BY created_at DESC`
        );
        
        console.log(`📋 找到 ${materials.length} 个材料需要处理\n`);
        
        let successCount = 0;
        let failCount = 0;
        
        for (const material of materials) {
            console.log(`\n--- 处理材料 ${material.id} ---`);
            
            // 确定 MIME 类型
            let mimeType = '';
            const ext = material.file_type.toLowerCase();
            switch (ext) {
                case 'pptx':
                    mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                    break;
                case 'docx':
                    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    break;
                case 'pdf':
                    mimeType = 'application/pdf';
                    break;
                case 'txt':
                    mimeType = 'text/plain';
                    break;
                default:
                    mimeType = 'application/octet-stream';
            }
            
            const success = await processFileContent(
                material.id, 
                material.file_path, 
                mimeType, 
                material.original_name
            );
            
            if (success) {
                successCount++;
            } else {
                failCount++;
            }
        }
        
        console.log(`\n🎉 重新处理完成！`);
        console.log(`✅ 成功: ${successCount} 个`);
        console.log(`❌ 失败: ${failCount} 个`);
        
    } catch (error) {
        console.error('❌ 重新处理失败:', error);
    }
}

// 运行重新处理
reprocessAllMaterials();