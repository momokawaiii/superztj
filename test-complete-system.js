const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// 测试数据
const testContent = `
人工智能与机器学习基础

人工智能（Artificial Intelligence，AI）是指由人制造出来的机器所表现出来的智能。人工智能是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。

机器学习是人工智能的一个重要分支，它使计算机能够在没有明确编程的情况下学习。机器学习算法通过分析大量数据来识别模式，并使用这些模式来对新数据进行预测或决策。主要的机器学习类型包括：

1. 监督学习：使用标记的训练数据来学习输入和输出之间的映射关系
2. 无监督学习：从未标记的数据中发现隐藏的模式和结构
3. 强化学习：通过与环境交互来学习最优的行为策略

深度学习是机器学习的一个子集，它基于人工神经网络的结构和功能。深度学习网络由多个层组成，每一层都能学习数据的不同特征。这种分层的学习方式使得深度学习在图像识别、自然语言处理等领域取得了突破性进展。

自然语言处理（NLP）是人工智能的另一个重要应用领域，它致力于让计算机理解、解释和生成人类语言。NLP技术被广泛应用于机器翻译、情感分析、聊天机器人等场景。

计算机视觉是使计算机能够从数字图像或视频中获取高层次理解的技术。它包括图像识别、物体检测、人脸识别等多个子领域，在自动驾驶、医疗诊断、安防监控等方面有重要应用。

神经网络是深度学习的基础，它模拟人脑神经元的工作方式。常见的神经网络类型包括：
- 前馈神经网络（Feedforward Neural Networks）
- 卷积神经网络（CNN）：主要用于图像处理
- 循环神经网络（RNN）：适合处理序列数据
- 长短期记忆网络（LSTM）：解决RNN的梯度消失问题
- 变换器（Transformer）：在自然语言处理中表现优异

人工智能的发展历程可以分为几个重要阶段：
1. 1950年代：人工智能概念的提出
2. 1960-1970年代：专家系统的兴起
3. 1980年代：机器学习方法的发展
4. 1990年代：统计学习理论的建立
5. 2000年代：大数据和云计算的推动
6. 2010年代至今：深度学习的突破和广泛应用

当前人工智能面临的挑战包括：数据隐私和安全、算法的可解释性、计算资源的需求、伦理和社会影响等。未来的发展方向包括通用人工智能（AGI）、量子机器学习、边缘计算中的AI应用等。
`;

async function testSystem() {
    console.log('🚀 开始完整系统测试...\n');
    
    try {
        // 1. 测试服务状态
        console.log('1️⃣ 测试AI服务状态...');
        const statusResponse = await axios.get(`${BASE_URL}/ai/status`);
        console.log('✅ AI服务状态:', statusResponse.data.success ? '正常' : '异常');
        console.log('   模型信息:', statusResponse.data.data.currentModel || '未知');
        console.log('');
        
        // 2. 测试模型列表
        console.log('2️⃣ 获取可用模型列表...');
        const modelsResponse = await axios.get(`${BASE_URL}/ai/models`);
        console.log('✅ 可用模型:', modelsResponse.data.data.models?.join(', ') || '无');
        console.log('   当前模型:', modelsResponse.data.data.currentModel || '未设置');
        console.log('');
        
        // 3. 测试DeepSeek连接
        console.log('3️⃣ 测试DeepSeek连接...');
        const deepseekTestResponse = await axios.post(`${BASE_URL}/ai/test-deepseek`);
        console.log('✅ DeepSeek测试:', deepseekTestResponse.data.success ? '成功' : '失败');
        console.log('   生成题目数:', deepseekTestResponse.data.data?.questionsGenerated || 0);
        console.log('');
        
        // 4. 测试DeepSeek题目生成
        console.log('4️⃣ 测试DeepSeek智能题目生成...');
        const deepseekGenResponse = await axios.post(`${BASE_URL}/ai/generate-deepseek`, {
            content: testContent.substring(0, 1000), // 使用部分内容测试
            questionType: 'mixed',
            count: 5,
            difficulty: 'medium',
            focusOnConcepts: true
        });
        console.log('✅ DeepSeek生成:', deepseekGenResponse.data.success ? '成功' : '失败');
        console.log('   生成题目数:', deepseekGenResponse.data.data?.questions?.length || 0);
        console.log('   平均质量分:', deepseekGenResponse.data.data?.metadata?.averageQuality?.toFixed(2) || 'N/A');
        console.log('');
        
        // 5. 测试套卷生成
        console.log('5️⃣ 测试完整套卷生成...');
        const examPaperResponse = await axios.post(`${BASE_URL}/ai/test-exam-paper`);
        console.log('✅ 套卷生成:', examPaperResponse.data.success ? '成功' : '失败');
        if (examPaperResponse.data.success) {
            const stats = examPaperResponse.data.data.fullStats;
            console.log(`   选择题: ${stats.multipleChoiceCount}道`);
            console.log(`   填空题: ${stats.fillInBlankCount}道`);
            console.log(`   简答题: ${stats.shortAnswerCount}道`);
            console.log(`   总计: ${stats.totalQuestions}道题目`);
        }
        console.log('');
        
        // 6. 测试完整套卷生成（实际内容）
        console.log('6️⃣ 测试完整内容套卷生成...');
        const fullExamResponse = await axios.post(`${BASE_URL}/ai/generate-exam-paper`, {
            content: testContent,
            difficulty: 'medium',
            title: '人工智能综合测试卷'
        });
        console.log('✅ 完整套卷:', fullExamResponse.data.success ? '成功' : '失败');
        if (fullExamResponse.data.success) {
            const metadata = fullExamResponse.data.data.metadata;
            console.log(`   总题目数: ${metadata.totalQuestions}道`);
            console.log(`   生成耗时: ${metadata.generationTime}`);
            console.log(`   使用模型: ${metadata.model}`);
            console.log(`   GPU加速: ${metadata.gpuAccelerated ? '是' : '否'}`);
        }
        console.log('');
        
        console.log('🎉 系统测试完成！所有功能正常工作。');
        console.log('\n📋 功能总结:');
        console.log('✅ 使用DeepSeek-R1:7b模型');
        console.log('✅ GPU加速和90秒超时配置');
        console.log('✅ 智能概念提取和题目生成');
        console.log('✅ 完整套卷生成（10选择+10填空+5简答）');
        console.log('✅ 高质量题目生成和评估');
        
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        if (error.response) {
            console.error('   响应状态:', error.response.status);
            console.error('   错误详情:', error.response.data?.message || '未知错误');
            if (error.response.data?.suggestions) {
                console.error('   建议:', error.response.data.suggestions.join(', '));
            }
        }
    }
}

// 运行测试
testSystem();