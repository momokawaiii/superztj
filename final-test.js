const axios = require('axios');

async function finalTest() {
    const baseURL = 'http://localhost:3001';
    
    console.log('🎉 最终验证 - DeepSeek修复测试\n');
    
    try {
        // 1. 验证模型配置
        console.log('1️⃣ 验证模型配置...');
        const modelsResponse = await axios.get(`${baseURL}/api/ai/models`);
        const isDeepSeekAvailable = modelsResponse.data.data.models.includes('deepseek-r1:7b');
        const currentModel = modelsResponse.data.data.currentModel;
        
        console.log(`   ✅ DeepSeek模型可用: ${isDeepSeekAvailable}`);
        console.log(`   ✅ 当前使用模型: ${currentModel}`);
        console.log(`   ✅ 模型配置正确: ${currentModel === 'deepseek-r1:7b'}`);
        
        // 2. 测试文档处理功能
        console.log('\n2️⃣ 测试文档处理功能...');
        const testContent = `
人工智能（Artificial Intelligence，AI）是指由人制造出来的机器所表现出来的智能。
人工智能是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。
机器学习是人工智能的一个重要分支，它使计算机能够在没有明确编程的情况下学习。
深度学习是机器学习的一个子集，它基于人工神经网络的结构和功能。
神经网络是一种模仿生物神经网络结构和功能的数学模型。
自然语言处理（NLP）是人工智能的一个重要应用领域。
        `;
        
        const generateResponse = await axios.post(`${baseURL}/api/ai/generate-questions`, {
            content: testContent,
            questionType: 'fill-blank',
            count: 3,
            difficulty: 'medium'
        });
        
        console.log('   ✅ 文档处理成功 - 没有processDocument错误');
        console.log(`   ✅ 生成题目数量: ${generateResponse.data.data.questions.length}`);
        
        // 3. 验证题目质量
        console.log('\n3️⃣ 验证题目质量...');
        const questions = generateResponse.data.data.questions;
        let qualityScore = 0;
        let conceptualQuestions = 0;
        
        questions.forEach((q, i) => {
            console.log(`\n   题目${i+1}: ${q.question}`);
            console.log(`   答案: ${q.correctAnswer || q.answer}`);
            console.log(`   来源: ${q.source || 'unknown'}`);
            
            // 检查是否是概念性题目
            if (q.question.includes('人工智能') || q.question.includes('机器学习') || 
                q.question.includes('深度学习') || q.question.includes('神经网络')) {
                conceptualQuestions++;
            }
            
            // 简单质量评估
            if (q.question && q.question.length > 10) qualityScore += 1;
            if (q.explanation && q.explanation.length > 20) qualityScore += 1;
            if (q.correctAnswer || q.answer) qualityScore += 1;
        });
        
        const avgQuality = qualityScore / (questions.length * 3);
        console.log(`\n   ✅ 概念性题目比例: ${conceptualQuestions}/${questions.length}`);
        console.log(`   ✅ 平均质量分数: ${(avgQuality * 100).toFixed(1)}%`);
        
        // 4. 总结修复结果
        console.log('\n🎯 修复验证总结:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const fixes = [
            {
                issue: '模型使用问题',
                fixed: currentModel === 'deepseek-r1:7b',
                description: '现在正确使用deepseek-r1:7b模型'
            },
            {
                issue: 'processDocument方法缺失',
                fixed: generateResponse.status === 200,
                description: '文档处理功能正常，不再报错'
            },
            {
                issue: '题目质量问题',
                fixed: conceptualQuestions > 0 && avgQuality > 0.6,
                description: '生成基于概念的高质量题目'
            }
        ];
        
        fixes.forEach((fix, i) => {
            const status = fix.fixed ? '✅ 已修复' : '❌ 未修复';
            console.log(`${i+1}. ${fix.issue}: ${status}`);
            console.log(`   ${fix.description}`);
        });
        
        const allFixed = fixes.every(fix => fix.fixed);
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(allFixed ? '🎉 所有问题已成功修复！' : '⚠️ 部分问题仍需处理');
        
        if (allFixed) {
            console.log('\n🚀 系统现在可以：');
            console.log('   • 使用DeepSeek-R1:7b模型生成题目');
            console.log('   • 正确处理文档内容，提取概念');
            console.log('   • 生成基于概念理解的高质量题目');
            console.log('   • 提供详细的解释和知识点');
            
            console.log('\n📝 使用建议：');
            console.log('   • 使用 POST /api/ai/generate-questions 进行普通生成');
            console.log('   • 使用 POST /api/ai/generate-deepseek 进行专门的DeepSeek生成');
            console.log('   • 提供较长的学习材料以获得更好的题目质量');
        }
        
    } catch (error) {
        console.error('❌ 测试失败:', error.response?.data?.message || error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 请确保服务器正在运行：');
            console.log('   node start-fixed.js');
        }
    }
}

// 运行最终测试
finalTest().catch(console.error);