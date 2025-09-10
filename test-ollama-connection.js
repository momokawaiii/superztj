const axios = require('axios');

async function testOllamaConnection() {
    console.log('🔍 测试 Ollama 连接...\n');
    
    const testUrls = [
        'http://127.0.0.1:11434',
        'http://localhost:11434',
        'http://[::1]:11434'
    ];
    
    for (const baseUrl of testUrls) {
        console.log(`📡 测试连接: ${baseUrl}`);
        try {
            const response = await axios.get(`${baseUrl}/api/tags`, {
                timeout: 5000,
                family: baseUrl.includes('127.0.0.1') ? 4 : undefined // 强制使用 IPv4
            });
            
            console.log(`✅ 连接成功!`);
            console.log(`📋 可用模型数量: ${response.data.models?.length || 0}`);
            
            if (response.data.models && response.data.models.length > 0) {
                console.log('📝 已安装的模型:');
                response.data.models.forEach(model => {
                    console.log(`   - ${model.name} (${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB)`);
                });
            } else {
                console.log('⚠️  没有找到已安装的模型');
                console.log('💡 请运行: ollama pull qwen2.5:7b');
            }
            
            // 测试生成功能
            console.log('\n🤖 测试模型生成...');
            const testModel = response.data.models?.[0]?.name || 'qwen2.5:7b';
            
            try {
                const generateResponse = await axios.post(`${baseUrl}/api/generate`, {
                    model: testModel,
                    prompt: '你好，请简单介绍一下自己。',
                    stream: false,
                    options: {
                        temperature: 0.7,
                        max_tokens: 100
                    }
                }, {
                    timeout: 15000
                });
                
                console.log(`✅ 模型 ${testModel} 工作正常`);
                console.log(`📄 响应示例: ${generateResponse.data.response?.substring(0, 100)}...`);
            } catch (genError) {
                console.log(`❌ 模型生成测试失败: ${genError.message}`);
                if (genError.response?.status === 404) {
                    console.log(`💡 模型 ${testModel} 可能未安装，请运行: ollama pull ${testModel}`);
                }
            }
            
            console.log(`\n🎯 推荐配置: OLLAMA_BASE_URL=${baseUrl}\n`);
            return baseUrl;
            
        } catch (error) {
            console.log(`❌ 连接失败: ${error.message}`);
            if (error.code === 'ECONNREFUSED') {
                console.log('💡 请确保 Ollama 服务正在运行: ollama serve');
            }
        }
        console.log('');
    }
    
    console.log('🚨 所有连接尝试都失败了！');
    console.log('\n🛠️  故障排除步骤:');
    console.log('1. 检查 Ollama 是否已安装: ollama --version');
    console.log('2. 启动 Ollama 服务: ollama serve');
    console.log('3. 检查端口占用: netstat -an | findstr 11434');
    console.log('4. 下载模型: ollama pull qwen2.5:7b');
    console.log('5. 测试模型: ollama run qwen2.5:7b "hello"');
    
    return null;
}

// 检查 Ollama 进程
async function checkOllamaProcess() {
    console.log('🔍 检查 Ollama 进程状态...\n');
    
    try {
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        
        // Windows 系统检查进程
        const { stdout } = await execAsync('tasklist | findstr ollama');
        if (stdout.trim()) {
            console.log('✅ Ollama 进程正在运行:');
            console.log(stdout);
        } else {
            console.log('❌ 未找到 Ollama 进程');
        }
    } catch (error) {
        console.log('❌ 未找到 Ollama 进程');
        console.log('💡 请启动 Ollama 服务: ollama serve');
    }
    console.log('');
}

// 主函数
async function main() {
    console.log('🚀 Ollama 连接诊断工具\n');
    console.log('=' * 50);
    
    await checkOllamaProcess();
    const workingUrl = await testOllamaConnection();
    
    if (workingUrl) {
        console.log('🎉 诊断完成！Ollama 连接正常');
        console.log(`✅ 建议在 .env 文件中设置: OLLAMA_BASE_URL=${workingUrl}`);
    } else {
        console.log('❌ 诊断完成！需要解决 Ollama 连接问题');
    }
}

// 运行诊断
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testOllamaConnection, checkOllamaProcess };