// 修复后的启动脚本
const path = require('path');

console.log('🚀 启动修复后的超级做题家系统...\n');

// 设置环境变量确保使用DeepSeek模型
process.env.OLLAMA_MODEL = 'deepseek-r1:7b';
process.env.USE_OLLAMA = 'true';

console.log('📋 配置信息:');
console.log('   模型: deepseek-r1:7b');
console.log('   Ollama: 启用');
console.log('   端口: 3001\n');

// 直接启动服务器，避免setup.js的冲突
try {
    require('./server.js');
} catch (error) {
    console.error('❌ 启动失败:', error.message);
    
    if (error.code === 'EADDRINUSE') {
        console.log('\n💡 解决方案:');
        console.log('1. 检查是否有其他实例在运行');
        console.log('2. 等待几秒后重试');
        console.log('3. 或者修改端口配置');
        
        // 尝试使用不同端口
        console.log('\n🔄 尝试使用端口3002...');
        process.env.PORT = '3002';
        
        setTimeout(() => {
            try {
                delete require.cache[require.resolve('./server.js')];
                require('./server.js');
            } catch (retryError) {
                console.error('❌ 重试失败:', retryError.message);
                process.exit(1);
            }
        }, 2000);
    } else {
        process.exit(1);
    }
}