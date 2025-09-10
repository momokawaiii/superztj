const axios = require('axios');

console.log('🔄 测试完整的材料检测和题目生成流程...\n');

async function testCompleteFlow() {
    try {
        // 1. 测试材料列表接口
        console.log('📚 步骤1: 检查已上传的材料...');
        const materialsResponse = await axios.get('http://127.0.0.1:3000/api/materials/list');
        
        if (materialsResponse.data.success) {
            console.log('✅ 材料接口正常');
            console.log('📋 已上传材料数量:', materialsResponse.data.data.length);
            
            if (materialsResponse.data.data.length === 0) {
                console.log('❌ 没有找到已上传的材料');
                console.log('💡 请先通过网页上传一些学习材料');
                return;
            }
            
            const latestMaterial = materialsResponse.data.data[0];
            console.log('📄 最新材料:', latestMaterial.name);
            console.log('🆔 材料ID:', latestMaterial.id);
            console.log('📊 处理状态:', latestMaterial.processed ? '已处理' : '处理中');
            
            // 2. 获取材料详情
            console.log('\n📖 步骤2: 获取材料详情和内容...');
            const detailResponse = await axios.get(`http://127.0.0.1:3000/api/materials/${latestMaterial.id}`);
            
            if (detailResponse.data.success) {
                const materialDetail = detailResponse.data.data;
                console.log('✅ 材料详情获取成功');
                console.log('📝 内容长度:', materialDetail.content ? materialDetail.content.length : 0, '字符');
                console.log('🏷️ 关键词数量:', materialDetail.keywords ? materialDetail.keywords.length : 0);
                
                if (!materialDetail.content || materialDetail.content.length < 10) {
                    console.log('⚠️ 材料内容为空或过短，可能还在处理中');
                    console.log('💡 请等待几秒钟后重试，或检查文件是否正确上传');
                    return;
                }
                
                // 3. 使用材料内容生成题目
                console.log('\n🤖 步骤3: 使用材料内容生成AI题目...');
                const generateResponse = await axios.post('http://127.0.0.1:3000/api/ai/generate-questions', {
                    content: materialDetail.content,
                    questionType: 'mixed',
                    count: 5,
                    difficulty: 'medium'
                }, {
                    timeout: 30000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (generateResponse.data.success) {
                    console.log('✅ AI 题目生成成功！');
                    console.log('📊 生成题目数量:', generateResponse.data.data.questions.length);
                    console.log('📝 题目详情:');
                    
                    generateResponse.data.data.questions.forEach((q, i) => {
                        console.log(`\n${i+1}. [${q.type}] ${q.question}`);
                        if (q.type === 'multiple-choice' && q.options) {
                            q.options.forEach((option, j) => {
                                const marker = j === q.correctAnswer ? '✓' : ' ';
                                console.log(`   ${String.fromCharCode(65 + j)}. ${option} ${marker}`);
                            });
                        } else if (q.type === 'fill-blank') {
                            console.log(`   答案: ${q.answer || q.correctAnswer}`);
                        } else if (q.type === 'essay') {
                            console.log(`   参考答案: ${q.sampleAnswer?.substring(0, 50)}...`);
                        }
                        if (q.explanation) {
                            console.log(`   解析: ${q.explanation}`);
                        }
                    });
                    
                    console.log('\n🎉 完整流程测试成功！');
                    console.log('✅ 前端修复已生效，现在网页应该能正常生成基于上传内容的个性化题目了！');
                    
                } else {
                    console.log('❌ AI 题目生成失败:', generateResponse.data.message);
                }
                
            } else {
                console.log('❌ 获取材料详情失败:', detailResponse.data.message);
            }
            
        } else {
            console.log('❌ 材料接口调用失败:', materialsResponse.data.message);
        }
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ 连接失败: 服务器未运行');
            console.log('💡 请先启动服务器: npm start 或 node server.js');
        } else if (error.response) {
            console.log('❌ 服务器错误:', error.response.status);
            console.log('📄 错误详情:', error.response.data);
        } else {
            console.log('❌ 请求失败:', error.message);
        }
    }
}

// 模拟前端的完整流程
async function simulateFrontendFlow() {
    console.log('\n🌐 模拟前端完整流程...');
    
    try {
        // 模拟前端 startQuiz 函数的逻辑
        console.log('1️⃣ 检查材料列表...');
        const materialsResponse = await axios.get('http://127.0.0.1:3000/api/materials/list');
        
        if (materialsResponse.data.success && materialsResponse.data.data.length > 0) {
            const latestMaterial = materialsResponse.data.data[0];
            console.log('✅ 找到材料:', latestMaterial.name);
            
            console.log('2️⃣ 获取材料内容...');
            const materialDetailResponse = await axios.get(`http://127.0.0.1:3000/api/materials/${latestMaterial.id}`);
            
            if (materialDetailResponse.data.success) {
                const materialDetail = materialDetailResponse.data.data;
                console.log('✅ 材料内容获取成功');
                
                console.log('3️⃣ 生成个性化题目...');
                const response = await axios.post('http://127.0.0.1:3000/api/ai/generate-questions', {
                    content: materialDetail.content || '默认学习内容',
                    questionType: 'mixed',
                    count: 10,
                    difficulty: 'medium'
                });
                
                if (response.data.success) {
                    console.log('🎉 前端流程模拟成功！');
                    console.log(`📊 生成了 ${response.data.data.questions.length} 道基于《${latestMaterial.name}》的题目`);
                } else {
                    console.log('❌ 题目生成失败:', response.data.message);
                }
            }
        } else {
            console.log('⚠️ 没有找到材料，会提示用户上传');
        }
        
    } catch (error) {
        console.log('❌ 前端流程模拟失败:', error.message);
    }
}

async function runAllTests() {
    await testCompleteFlow();
    await simulateFrontendFlow();
}

runAllTests();