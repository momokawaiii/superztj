const axios = require('axios');

// 测试DeepSeek修复的脚本
async function testDeepSeekFix() {
    const baseURL = 'http://localhost:3001';
    
    console.log('🧪 开始测试DeepSeek修复...\n');
    
    try {
        // 1. 测试AI服务状态
        console.log('1️⃣ 测试AI服务状态...');
        const statusResponse = await axios.get(`${baseURL}/api/ai/status`);
        console.log('✅ AI服务状态:', statusResponse.data.data.mode);
        console.log('📋 当前模型:', statusResponse.data.data.currentModel);
        console.log('🎯 可用模型:', statusResponse.data.data.models?.join(', ') || '无');
        
        // 2. 测试模型列表
        console.log('\n2️⃣ 测试模型列表...');
        const modelsResponse = await axios.get(`${baseURL}/api/ai/models`);
        console.log('✅ 模型列表获取成功');
        console.log('📋 可用模型:', modelsResponse.data.data.models);
        console.log('🎯 当前模型:', modelsResponse.data.data.currentModel);
        console.log('✅ DeepSeek模型存在:', modelsResponse.data.data.models.some(m => m.includes('deepseek')));
        
        // 3. 测试DeepSeek连接
        console.log('\n3️⃣ 测试DeepSeek连接...');
        try {
            const deepseekTestResponse = await axios.post(`${baseURL}/api/ai/test-deepseek`);
            console.log('✅ DeepSeek测试成功');
            console.log('📊 生成题目数量:', deepseekTestResponse.data.data.questionsGenerated);
            console.log('🎯 使用模型:', deepseekTestResponse.data.data.modelUsed);
            
            if (deepseekTestResponse.data.data.sampleQuestions?.length > 0) {
                console.log('📝 示例题目:');
                deepseekTestResponse.data.data.sampleQuestions.forEach((q, i) => {
                    console.log(`   ${i+1}. ${q.question}`);
                    console.log(`      类型: ${q.type}, 来源: ${q.source || 'unknown'}`);
                });
            }
        } catch (deepseekError) {
            console.log('❌ DeepSeek测试失败:', deepseekError.response?.data?.message || deepseekError.message);
            console.log('💡 建议:', deepseekError.response?.data?.suggestions?.join(', ') || '检查DeepSeek模型是否可用');
        }
        
        // 4. 测试文档处理和题目生成
        console.log('\n4️⃣ 测试文档处理和题目生成...');
        const testContent = `
人工智能（Artificial Intelligence，AI）是指由人制造出来的机器所表现出来的智能。
人工智能是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。
机器学习是人工智能的一个重要分支，它使计算机能够在没有明确编程的情况下学习。
深度学习是机器学习的一个子集，它基于人工神经网络的结构和功能。
神经网络是一种模仿生物神经网络结构和功能的数学模型。
自然语言处理（NLP）是人工智能的一个重要应用领域，它使计算机能够理解和处理人类语言。
计算机视觉是另一个重要的AI应用领域，它使计算机能够识别和理解图像和视频内容。
        `;
        
        try {
            const generateResponse = await axios.post(`${baseURL}/api/ai/generate-deepseek`, {
                content: testContent,
                questionType: 'mixed',
                count: 5,
                difficulty: 'medium',
                focusOnConcepts: true
            });
            
            console.log('✅ DeepSeek题目生成成功');
            console.log('📊 生成题目数量:', generateResponse.data.data.questions.length);
            console.log('🎯 使用模型:', generateResponse.data.data.metadata.model);
            console.log('⭐ 增强题目数量:', generateResponse.data.data.metadata.enhancedCount);
            console.log('📈 平均质量分数:', generateResponse.data.data.metadata.averageQuality.toFixed(2));
            
            console.log('\n📝 生成的题目示例:');
            generateResponse.data.data.questions.slice(0, 3).forEach((q, i) => {
                console.log(`\n${i+1}. 【${q.type}】${q.question}`);
                if (q.options) {
                    q.options.forEach((opt, j) => {
                        const marker = j === q.correctAnswer ? '✓' : ' ';
                        console.log(`   ${marker} ${String.fromCharCode(65+j)}. ${opt}`);
                    });
                }
                if (q.correctAnswer !== undefined && !q.options) {
                    console.log(`   答案: ${q.correctAnswer}`);
                }
                console.log(`   来源: ${q.source || 'unknown'}, 质量: ${(q.qualityScore || 0).toFixed(2)}`);
                if (q.explanation) {
                    console.log(`   解释: ${q.explanation.substring(0, 100)}...`);
                }
            });
            
        } catch (generateError) {
            console.log('❌ DeepSeek题目生成失败:', generateError.response?.data?.message || generateError.message);
            
            // 尝试普通生成作为对比
            console.log('\n🔄 尝试普通题目生成作为对比...');
            try {
                const normalResponse = await axios.post(`${baseURL}/api/ai/generate-questions`, {
                    content: testContent,
                    questionType: 'mixed',
                    count: 3,
                    difficulty: 'medium'
                });
                
                console.log('✅ 普通题目生成成功');
                console.log('📊 生成题目数量:', normalResponse.data.data.questions.length);
                console.log('📝 示例题目:', normalResponse.data.data.questions[0]?.question || '无');
                
            } catch (normalError) {
                console.log('❌ 普通题目生成也失败:', normalError.response?.data?.message || normalError.message);
            }
        }
        
        console.log('\n🎉 测试完成！');
        
    } catch (error) {
        console.error('❌ 测试过程中发生错误:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 请确保服务器正在运行在端口3001');
        }
    }
}

// 运行测试
testDeepSeekFix().catch(console.error);