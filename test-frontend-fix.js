const axios = require('axios');

console.log('🧪 测试修复后的题目生成功能...');

// 模拟前端请求
const testContent = '人工智能是计算机科学的重要分支，包括机器学习、深度学习、自然语言处理等技术。机器学习通过算法让计算机从数据中学习模式，深度学习使用神经网络模拟人脑工作方式，自然语言处理让计算机理解和生成人类语言。';

async function testAIGeneration() {
    try {
        console.log('📡 发送请求到 AI 生成接口...');
        
        const response = await axios.post('http://127.0.0.1:3000/api/ai/generate-questions', {
            content: testContent,
            questionType: 'mixed',
            count: 5,
            difficulty: 'medium'
        }, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.data.success) {
            console.log('✅ AI 生成成功!');
            console.log('📊 生成题目数量:', response.data.data.questions.length);
            console.log('📝 题目详情:');
            
            response.data.data.questions.forEach((q, i) => {
                console.log(`${i+1}. [${q.type}] ${q.question.substring(0, 60)}...`);
                if (q.type === 'multiple-choice' && q.options) {
                    console.log(`   选项数量: ${q.options.length}`);
                } else if (q.type === 'fill-blank' && q.answer) {
                    console.log(`   答案: ${q.answer}`);
                }
            });
            
            console.log('\n🎉 前端修复验证成功！现在网页应该能正常生成基于内容的题目了。');
        } else {
            console.log('❌ 生成失败:', response.data.message);
        }
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ 连接失败: 服务器未运行');
            console.log('💡 请先启动服务器: npm start 或 node server.js');
        } else if (error.response) {
            console.log('❌ 服务器错误:', error.response.status, error.response.data);
        } else {
            console.log('❌ 请求失败:', error.message);
        }
    }
}

// 测试材料接口
async function testMaterialsAPI() {
    try {
        console.log('\n📚 测试材料接口...');
        const response = await axios.get('http://127.0.0.1:3000/api/materials/list');
        
        if (response.data.success) {
            console.log('✅ 材料接口正常');
            console.log('📋 已上传材料数量:', response.data.data.length);
            
            if (response.data.data.length > 0) {
                console.log('📄 最新材料:', response.data.data[0].name);
            } else {
                console.log('💡 提示: 还没有上传任何材料');
            }
        }
    } catch (error) {
        console.log('❌ 材料接口测试失败:', error.message);
    }
}

async function runTests() {
    await testMaterialsAPI();
    await testAIGeneration();
}

runTests();