const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const os = require('os');

class AutoSetup {
    constructor() {
        this.platform = os.platform();
        this.isWindows = this.platform === 'win32';
        this.isMac = this.platform === 'darwin';
        this.isLinux = this.platform === 'linux';
    }

    // 彩色输出函数
    log(message, type = 'info') {
        const colors = {
            info: '\x1b[36m',    // 青色
            success: '\x1b[32m', // 绿色
            warning: '\x1b[33m', // 黄色
            error: '\x1b[31m',   // 红色
            reset: '\x1b[0m'     // 重置
        };
        console.log(`${colors[type]}${message}${colors.reset}`);
    }

    // 检查命令是否存在
    commandExists(command) {
        try {
            execSync(`${command} --version`, { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    }

    // 检查Node.js环境
    checkNodeJS() {
        this.log('\n🔍 检查Node.js环境...', 'info');
        
        if (!this.commandExists('node')) {
            this.log('❌ 未找到Node.js', 'error');
            this.showNodeJSInstallGuide();
            return false;
        }

        try {
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
            
            if (majorVersion < 16) {
                this.log(`❌ Node.js版本过低 (${nodeVersion})，需要16.0+`, 'error');
                this.showNodeJSInstallGuide();
                return false;
            }

            this.log(`✅ Node.js环境正常 (${nodeVersion})`, 'success');
            return true;
        } catch (error) {
            this.log('❌ Node.js版本检查失败', 'error');
            return false;
        }
    }

    // 显示Node.js安装指南
    showNodeJSInstallGuide() {
        this.log('\n📖 Node.js安装指南:', 'warning');
        
        if (this.isWindows) {
            this.log('Windows系统:', 'info');
            this.log('1. 访问 https://nodejs.org/', 'info');
            this.log('2. 下载LTS版本（推荐18.x或20.x）', 'info');
            this.log('3. 运行安装程序，按默认设置安装', 'info');
            this.log('4. 重新打开命令提示符或PowerShell', 'info');
        } else if (this.isMac) {
            this.log('macOS系统:', 'info');
            this.log('方法1 - 使用Homebrew（推荐）:', 'info');
            this.log('  brew install node', 'info');
            this.log('方法2 - 官网下载:', 'info');
            this.log('  访问 https://nodejs.org/ 下载安装包', 'info');
        } else if (this.isLinux) {
            this.log('Linux系统:', 'info');
            this.log('Ubuntu/Debian:', 'info');
            this.log('  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -', 'info');
            this.log('  sudo apt-get install -y nodejs', 'info');
            this.log('CentOS/RHEL:', 'info');
            this.log('  curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -', 'info');
            this.log('  sudo yum install -y nodejs', 'info');
        }
        
        this.log('\n安装完成后，请重新运行此脚本。', 'warning');
    }

    // 检查并安装项目依赖
    async checkDependencies() {
        this.log('\n📦 检查项目依赖...', 'info');
        
        if (!fs.existsSync('node_modules') || !fs.existsSync('package-lock.json')) {
            this.log('⚠️  首次运行，需要安装依赖包...', 'warning');
            return await this.installDependencies();
        }

        // 检查package.json是否有更新
        try {
            const packageStats = fs.statSync('package.json');
            const lockStats = fs.statSync('package-lock.json');
            
            if (packageStats.mtime > lockStats.mtime) {
                this.log('⚠️  检测到package.json有更新，重新安装依赖...', 'warning');
                return await this.installDependencies();
            }
        } catch (error) {
            this.log('⚠️  依赖检查异常，重新安装...', 'warning');
            return await this.installDependencies();
        }

        this.log('✅ 项目依赖已就绪', 'success');
        return true;
    }

    // 安装项目依赖
    async installDependencies() {
        this.log('正在安装依赖包，请稍候...', 'info');
        
        return new Promise((resolve) => {
            const npmCommand = this.isWindows ? 'npm.cmd' : 'npm';
            const installProcess = spawn(npmCommand, ['install'], {
                stdio: 'inherit',
                shell: true
            });

            installProcess.on('close', (code) => {
                if (code === 0) {
                    this.log('✅ 依赖安装完成！', 'success');
                    resolve(true);
                } else {
                    this.log('❌ 依赖安装失败', 'error');
                    this.showDependencyTroubleshooting();
                    resolve(false);
                }
            });

            installProcess.on('error', (error) => {
                this.log(`❌ 安装过程出错: ${error.message}`, 'error');
                this.showDependencyTroubleshooting();
                resolve(false);
            });
        });
    }

    // 依赖安装故障排除
    showDependencyTroubleshooting() {
        this.log('\n🔧 依赖安装故障排除:', 'warning');
        this.log('1. 检查网络连接', 'info');
        this.log('2. 尝试使用国内镜像:', 'info');
        this.log('   npm install --registry https://registry.npmmirror.com', 'info');
        this.log('3. 清除npm缓存:', 'info');
        this.log('   npm cache clean --force', 'info');
        this.log('4. 删除node_modules文件夹后重试', 'info');
    }

    // 创建必要的目录
    createDirectories() {
        this.log('\n📁 创建必要目录...', 'info');
        
        const dirs = ['uploads', 'data', 'logs'];
        let created = 0;

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                try {
                    fs.mkdirSync(dir, { recursive: true });
                    this.log(`✅ 创建目录: ${dir}`, 'success');
                    created++;
                } catch (error) {
                    this.log(`❌ 创建目录失败: ${dir} - ${error.message}`, 'error');
                }
            }
        });

        if (created === 0) {
            this.log('✅ 所有必要目录已存在', 'success');
        }
    }

    // 检查并创建环境配置文件
    checkEnvironmentConfig() {
        this.log('\n⚙️  检查环境配置...', 'info');
        
        if (!fs.existsSync('.env')) {
            if (fs.existsSync('.env.example')) {
                try {
                    fs.copyFileSync('.env.example', '.env');
                    this.log('✅ 已创建.env配置文件', 'success');
                    this.log('💡 您可以编辑.env文件来自定义配置', 'info');
                } catch (error) {
                    this.log(`❌ 创建.env文件失败: ${error.message}`, 'error');
                }
            } else {
                this.createDefaultEnvFile();
            }
        } else {
            this.log('✅ 环境配置文件已存在', 'success');
        }
    }

    // 创建默认环境配置文件
    createDefaultEnvFile() {
        const defaultEnv = `# 服务器配置
PORT=3000
NODE_ENV=development

# JWT密钥 (请修改为你自己的密钥)
JWT_SECRET=your-super-secret-key-change-this-in-production

# 数据库配置
DB_PATH=./data/study_helper.db

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# AI服务配置
AI_MODEL_PATH=./models/your-llm-model
AI_API_ENDPOINT=http://localhost:11434/api/generate
AI_MODEL_NAME=llama2:7b
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2048

# 日志配置
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# 安全配置
BCRYPT_ROUNDS=10
SESSION_SECRET=your-session-secret
`;

        try {
            fs.writeFileSync('.env', defaultEnv);
            this.log('✅ 已创建默认.env配置文件', 'success');
        } catch (error) {
            this.log(`❌ 创建.env文件失败: ${error.message}`, 'error');
        }
    }

    // 检查端口是否被占用
    async checkPort(port = 3000) {
        return new Promise((resolve) => {
            const net = require('net');
            const server = net.createServer();

            server.listen(port, () => {
                server.once('close', () => {
                    resolve(true);
                });
                server.close();
            });

            server.on('error', () => {
                resolve(false);
            });
        });
    }

    // 检查并处理端口冲突
    async handlePortConflict() {
        this.log('\n🔌 检查端口可用性...', 'info');
        
        const defaultPort = 3000;
        const isPortAvailable = await this.checkPort(defaultPort);
        
        if (!isPortAvailable) {
            this.log(`⚠️  端口${defaultPort}被占用`, 'warning');
            
            // 尝试找到可用端口
            for (let port = 3000; port <= 3010; port++) {
                if (await this.checkPort(port)) {
                    this.log(`✅ 找到可用端口: ${port}`, 'success');
                    
                    // 更新.env文件中的端口
                    try {
                        let envContent = fs.readFileSync('.env', 'utf8');
                        envContent = envContent.replace(/PORT=\d+/, `PORT=${port}`);
                        fs.writeFileSync('.env', envContent);
                        this.log(`✅ 已更新配置文件端口为: ${port}`, 'success');
                    } catch (error) {
                        this.log(`⚠️  无法更新端口配置: ${error.message}`, 'warning');
                    }
                    return port;
                }
            }
            
            this.log('❌ 未找到可用端口，请手动停止占用3000端口的程序', 'error');
            return null;
        }
        
        this.log('✅ 默认端口3000可用', 'success');
        return defaultPort;
    }

    // 显示AI服务配置指南
    showAIServiceGuide() {
        this.log('\n🤖 AI服务配置指南（可选）:', 'info');
        this.log('为了使用AI功能，您需要配置本地LLM服务:', 'info');
        this.log('\n推荐方案 - Ollama:', 'warning');
        
        if (this.isWindows) {
            this.log('1. 下载Ollama: https://ollama.ai/download/windows', 'info');
            this.log('2. 安装后打开命令提示符', 'info');
            this.log('3. 运行: ollama pull llama2:7b', 'info');
            this.log('4. 运行: ollama serve', 'info');
        } else if (this.isMac) {
            this.log('1. 下载Ollama: https://ollama.ai/download/mac', 'info');
            this.log('2. 或使用Homebrew: brew install ollama', 'info');
            this.log('3. 运行: ollama pull llama2:7b', 'info');
            this.log('4. 运行: ollama serve', 'info');
        } else {
            this.log('1. 安装: curl -fsSL https://ollama.ai/install.sh | sh', 'info');
            this.log('2. 运行: ollama pull llama2:7b', 'info');
            this.log('3. 运行: ollama serve', 'info');
        }
        
        this.log('\n其他选择:', 'info');
        this.log('- LM Studio: https://lmstudio.ai/', 'info');
        this.log('- GPT4All: https://gpt4all.io/', 'info');
        this.log('\n💡 不配置AI服务也可以使用基础功能', 'warning');
    }

    // 显示启动成功信息
    showSuccessInfo(port) {
        this.log('\n🎉 环境配置完成！', 'success');
        this.log('========================================', 'info');
        this.log('   超级做题家 - AI学习辅助工具', 'info');
        this.log('========================================', 'info');
        this.log(`\n🌐 访问地址: http://localhost:${port}`, 'success');
        this.log('📱 支持手机访问: http://你的IP地址:' + port, 'info');
        this.log('\n🎯 功能特色:', 'info');
        this.log('• 📚 上传学习材料（PDF、Word、PPT等）', 'info');
        this.log('• 🧠 AI自动生成练习题目', 'info');
        this.log('• 🤖 智能批改和讲解', 'info');
        this.log('• 📊 学习数据分析', 'info');
        this.log('• 🎯 错题强化练习', 'info');
        this.log('\n⌨️  按 Ctrl+C 停止服务器', 'warning');
        this.log('📖 更多帮助请查看 README.md', 'info');
    }

    // 主要设置流程
    async run() {
        console.clear();
        this.log('🚀 超级做题家 - 自动环境配置', 'info');
        this.log('========================================', 'info');

        // 1. 检查Node.js
        if (!this.checkNodeJS()) {
            process.exit(1);
        }

        // 2. 检查并安装依赖
        if (!await this.checkDependencies()) {
            process.exit(1);
        }

        // 3. 创建必要目录
        this.createDirectories();

        // 4. 检查环境配置
        this.checkEnvironmentConfig();

        // 5. 检查端口
        const availablePort = await this.handlePortConflict();
        if (!availablePort) {
            process.exit(1);
        }

        // 6. 显示AI服务指南
        this.showAIServiceGuide();

        // 7. 显示成功信息
        this.showSuccessInfo(availablePort);

        return availablePort;
    }
}

// 如果直接运行此文件
if (require.main === module) {
    const setup = new AutoSetup();
    setup.run().then((port) => {
        if (port) {
            // 启动应用
            const app = require('./server.js');
        }
    }).catch((error) => {
        console.error('设置过程出错:', error);
        process.exit(1);
    });
}

module.exports = AutoSetup;