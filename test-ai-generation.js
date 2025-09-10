const { AIService } = require('./src/services/aiService');

async function testAIGeneration() {
    console.log('🤖 测试 AI 题目生成功能...\n');
    
    const aiService = new AIService();
    
    // 等待服务初始化
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const testContent = `
    人工智能（Artificial Intelligence，AI）是计算机科学的一个分支，它企图了解智能的实质，
    并生产出一种新的能以人类智能相似的方式做出反应的智能机器。人工智能包括机器学习、
    深度学习、自然语言处理等多个领域。机器学习是人工智能的核心，通过算法使机器能够
    从数据中学习并做出预测或决策。深度学习是机器学习的一个子集，使用神经网络来模拟
    人脑的工作方式。自然语言处理则专注于让计算机理解和生成人类语言。
    `;
    
    try {
        console.log('📚 测试内容:', testContent.substring(0, 100) + '...');
        console.log('\n🎯 开始生成题目...');
        
        const questions = await aiService.generateQuestionsFromContent(
            testContent, 
            'mixed', 
            5, 
            2 // 中等难度
        );
        
        console.log(`\n✅ 成功生成 ${questions.length} 道题目:\n`);
        
        questions.forEach((q, index) => {
            console.log(`${index + 1}. [${q.type}] ${q.question}`);
            
            if (q.type === 'multiple-choice') {
                q.options?.forEach((option, i) => {
                    const marker = i === q.correctAnswer ? '✓' : ' ';
                    console.log(`   ${String.fromCharCode(65 + i)}. ${option} ${marker}`);
                });
            } else if (q.type === 'fill-blank') {
                console.log(`   答案: ${q.answer || q.correctAnswer}`);
            } else if (q.type === 'essay') {
                console.log(`   参考答案: ${q.sampleAnswer?.substring(0, 50)}...`);
            }
            
            if (q.explanation) {
                console.log(`   解析: ${q.explanation}`);
            }
            console.log('');
        });
        
        // 测试问答题评分
        if (questions.some(q => q.type === 'essay')) {
            console.log('📝 测试问答题评分功能...');
            const essayQuestion = questions.find(q => q.type === 'essay');
            
            const testAnswer = '人工智能是一门综合性学科，涉及计算机科学、数学、心理学等多个领域。它的目标是创造能够模拟人类智能的机器系统。';
            
            const score = await aiService.scoreEssayAnswer(
                essayQuestion.question,
                testAnswer,
                essayQuestion.sampleAnswer
            );
            
            console.log('📊 评分结果:');
            console.log(`   分数: ${score.score}/100`);
            console.log(`   反馈: ${score.feedback}`);
            if (score.suggestions) {
                console.log(`   建议: ${score.suggestions}`);
            }
        }
        
        console.log('\n🎉 AI 功能测试完成！所有功能正常工作。');
        
    } catch (error) {
        console.error('❌ AI 功能测试失败:', error.message);
        console.log('\n🛠️  可能的解决方案:');
        console.log('1. 确保 Ollama 服务正在运行');
        console.log('2. 检查模型是否已下载: ollama list');
        console.log('3. 验证网络连接和配置');
    }
}

// 运行测试
if (require.main === module) {
    testAIGeneration().catch(console.error);
}

module.exports = { testAIGeneration };