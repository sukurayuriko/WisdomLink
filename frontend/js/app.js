/**
 * 智链AI阅读助手 - 主入口文件
 * 负责应用初始化、全局状态管理、组件协调
 */

class AIReaderApp {
    constructor() {
        this.isInitialized = false;
        this.currentFunction = null;
        this.currentUser = null;
        this.config = {
            apiBaseUrl: '/api',
            uploadMaxSize: 10 * 1024 * 1024, // 10MB
            supportedFileTypes: ['.txt', '.md', '.pdf', '.docx', '.jpg', '.jpeg', '.png', '.gif'],
            chatHistoryLimit: 100
        };
        this.init();
    }

    /**
     * 应用初始化
     */
    async init() {
        try {
            showLoading('初始化应用...');
            
            // 检查用户登录状态
            await this.checkAuthStatus();
            
            // 初始化UI组件
            this.initComponents();
            
            // 绑定全局事件
            this.bindGlobalEvents();
            
            // 初始化默认状态
            this.initDefaultState();
              this.isInitialized = true;
            hideLoading();
            
            // 调试界面状态
            this.debugInterfaceState();
            
            // 检查移动端菜单是否正确初始化
            this.checkMobileMenuStatus();

            console.log('智链AI阅读助手初始化完成');
        } catch (error) {
            console.error('应用初始化失败:', error);
            hideLoading();
            showNotification('应用初始化失败，请刷新页面重试', 'error');
        }
    }

    /**
     * 检查用户认证状态
     */
    async checkAuthStatus() {
        // 认证状态由 authManager 统一管理
        // 监听认证状态变化事件
        document.addEventListener('userStateChanged', (e) => {
            this.currentUser = e.detail.user;
            console.log('App接收到用户状态变化:', this.currentUser);
        });
    }

    /**
     * 初始化UI组件
     */
    initComponents() {
        // 功能按钮事件绑定
        this.bindFunctionButtons();
        
        // 搜索框事件绑定
        this.bindSearchEvents();
        
        // 工具栏事件绑定
        this.bindToolbarEvents();
        
        // 响应式处理
        this.handleResponsive();
    }

    /**
     * 绑定功能按钮事件
     */
    bindFunctionButtons() {
        // 智能伴读
        document.getElementById('intelligentReading')?.addEventListener('click', () => {
            this.switchFunction('intelligent-reading');
        });

        // 全面分析
        document.getElementById('comprehensiveAnalysis')?.addEventListener('click', () => {
            this.switchFunction('comprehensive-analysis');
        });

        // 专家解读/大师分析
        document.getElementById('expertAnalysis')?.addEventListener('click', () => {
            this.switchFunction('expert-analysis');
        });

        // 真伪判定/真伪鉴定
        document.getElementById('factChecking')?.addEventListener('click', () => {
            this.switchFunction('fact-checking');
        });
    }

    /**
     * 绑定搜索相关事件
     */
    bindSearchEvents() {
        const searchInput = document.getElementById('searchInput');
        const sendButton = document.getElementById('sendButton');

        // 只在欢迎界面处理搜索事件
        const handleSearchIfWelcomeScreen = () => {
            console.log('=== handleSearchIfWelcomeScreen 被调用 ===');
            const welcomeScreen = document.getElementById('welcomeScreen');
            const chatScreen = document.getElementById('chatScreen');
            
            // 只有在欢迎界面显示且聊天界面隐藏时才处理
            if (welcomeScreen && chatScreen) {
                const isWelcomeVisible = welcomeScreen.style.display !== 'none';
                const isChatHidden = chatScreen.style.display === 'none' || !chatScreen.style.display;
                
                console.log('界面状态检查 - 欢迎界面可见:', isWelcomeVisible, '聊天界面隐藏:', isChatHidden);
                
                if (isWelcomeVisible && isChatHidden) {
                    console.log('条件满足，调用 handleSearch');
                    this.handleSearch();
                } else {
                    console.log('条件不满足，不执行搜索');
                }
            } else {
                console.log('界面元素不存在');
            }
        };

        // 搜索输入事件 - 只在欢迎界面生效
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                const welcomeScreen = document.getElementById('welcomeScreen');
                const chatScreen = document.getElementById('chatScreen');
                
                // 检查是否在欢迎界面
                if (welcomeScreen && chatScreen) {
                    const isWelcomeVisible = welcomeScreen.style.display !== 'none';
                    const isChatHidden = chatScreen.style.display === 'none' || !chatScreen.style.display;
                    
                    if (isWelcomeVisible && isChatHidden) {
                        e.preventDefault();
                        handleSearchIfWelcomeScreen();
                    }
                }
            }
        });

        // 发送按钮事件 - 只在欢迎界面生效
        sendButton?.addEventListener('click', (e) => {
            console.log('=== 发送按钮被点击 ===');
            const welcomeScreen = document.getElementById('welcomeScreen');
            const chatScreen = document.getElementById('chatScreen');
            
            console.log('欢迎界面元素:', welcomeScreen);
            console.log('聊天界面元素:', chatScreen);
            
            if (welcomeScreen) {
                console.log('欢迎界面样式:', welcomeScreen.style.display);
                console.log('欢迎界面计算样式:', window.getComputedStyle(welcomeScreen).display);
            }
            
            if (chatScreen) {
                console.log('聊天界面样式:', chatScreen.style.display);
                console.log('聊天界面计算样式:', window.getComputedStyle(chatScreen).display);
            }
            
            // 检查是否在欢迎界面
            if (welcomeScreen && chatScreen) {
                const welcomeDisplayStyle = window.getComputedStyle(welcomeScreen).display;
                const chatDisplayStyle = window.getComputedStyle(chatScreen).display;
                
                const isWelcomeVisible = welcomeDisplayStyle !== 'none';
                const isChatHidden = chatDisplayStyle === 'none';
                
                console.log('欢迎界面可见:', isWelcomeVisible);
                console.log('聊天界面隐藏:', isChatHidden);
                
                if (isWelcomeVisible && isChatHidden) {
                    console.log('在欢迎界面，触发搜索处理');
                    e.preventDefault();
                    e.stopPropagation();
                    handleSearchIfWelcomeScreen();
                } else {
                    console.log('不在欢迎界面，跳过处理');
                    console.log('可能在聊天界面，让chat.js处理');
                }
            } else {
                console.log('界面元素缺失');
            }
        });

        // 输入框自适应高度
        searchInput?.addEventListener('input', () => {
            this.adjustTextareaHeight(searchInput);
        });

        // 调试发送按钮的存在性
        console.log('=== 检查发送按钮 ===');
        console.log('sendButton 元素:', sendButton);
        if (sendButton) {
            console.log('发送按钮存在，已添加事件监听器');
        } else {
            console.log('警告：发送按钮不存在！');
        }
    }

    /**
     * 绑定工具栏事件
     */
    bindToolbarEvents() {
        // 简洁模式切换
        document.getElementById('compactModeToggle')?.addEventListener('click', () => {
            this.toggleCompactMode();
        });

        // 设置按钮
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.openSettings();
        });

        // 帮助按钮
        document.getElementById('helpBtn')?.addEventListener('click', () => {
            this.openHelp();
        });
    }

    /**
     * 绑定全局事件
     */
    bindGlobalEvents() {
        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResponsive();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // 拖拽文件
        this.bindDragDropEvents();

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    /**
     * 绑定拖拽事件
     */
    bindDragDropEvents() {
        const uploadArea = document.getElementById('uploadArea');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea?.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea?.addEventListener(eventName, () => {
                uploadArea.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea?.addEventListener(eventName, () => {
                uploadArea.classList.remove('drag-over');
            });
        });

        uploadArea?.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0 && uploadManager) {
                uploadManager.handleFileUpload(files);
            }
        });
    }

    /**
     * 切换功能模块
     */
    switchFunction(functionName) {
        // 检查是否在聊天模式，如果是则退出聊天模式
        this.exitChatModeIfActive();
        
        // 更新当前功能
        this.currentFunction = functionName;

        // 更新UI状态
        this.updateFunctionButtons(functionName);

        // 更新搜索框占位符
        this.updateSearchPlaceholder(functionName);

        // 清空聊天内容（如果需要）
        if (this.shouldClearChatOnSwitch(functionName)) {
            this.clearChatMessages();
        }

        // 显示功能说明
        this.showFunctionDescription(functionName);

        // 触发功能切换事件，通知其他组件
        const event = new CustomEvent('functionChanged', {
            detail: { function: functionName }
        });
        document.dispatchEvent(event);

        console.log(`切换到功能: ${functionName}`);
    }

    /**
     * 退出聊天模式（如果当前在聊天模式）
     */
    exitChatModeIfActive() {
        const chatScreen = document.getElementById('chatScreen');
        const welcomeScreen = document.getElementById('welcomeScreen');
        
        // 检查是否在聊天模式
        if (chatScreen && welcomeScreen) {
            const isChatActive = chatScreen.style.display !== 'none' && chatScreen.style.display !== '';
            
            if (isChatActive) {
                console.log('退出聊天模式，返回主页');
                
                // 隐藏聊天界面
                chatScreen.style.display = 'none';
                
                // 显示欢迎界面
                welcomeScreen.style.display = 'flex';
                
                // 清除聊天内容
                this.clearChatMessages();
                
                // 重置到初始状态
                this.resetToInitialState();
                
                // 滚动到顶部
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    /**
     * 重置到初始状态
     */
    resetToInitialState() {
        // 确保欢迎界面正确显示
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
            // 清除任何可能的内联样式覆盖
            welcomeScreen.style.maxWidth = '';
            welcomeScreen.style.margin = '';
            welcomeScreen.style.padding = '';
        }
        
        // 显示上传区域
        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection) {
            uploadSection.style.display = 'block';
        }
        
        // 重置专家选择器显示状态
        const expertSelector = document.getElementById('expertSelector');
        if (expertSelector) {
            expertSelector.style.display = 'none';
        }
        
        // 清除任何进度状态
        const progressScreen = document.getElementById('progressScreen');
        if (progressScreen) {
            progressScreen.style.display = 'none';
        }
        
        // 重置输入框
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            this.updateSearchPlaceholder(this.currentFunction);
        }
        
        // 重置文件上传状态
        if (window.fileUploadManager && typeof window.fileUploadManager.resetState === 'function') {
            window.fileUploadManager.resetState();
        }
    }

    /**
     * 更新功能按钮状态
     */
    updateFunctionButtons(activeFunction) {
        const functionButtons = document.querySelectorAll('.function-btn');
        
        functionButtons.forEach(btn => {
            btn.classList.remove('active');
            
            if (btn.id === this.getFunctionButtonId(activeFunction)) {
                btn.classList.add('active');
            }
        });
    }

    /**
     * 获取功能按钮ID
     */
    getFunctionButtonId(functionName) {
        const mapping = {
            'intelligent-reading': 'intelligentReading',
            'comprehensive-analysis': 'comprehensiveAnalysis',
            'expert-analysis': 'expertAnalysis',
            'fact-checking': 'factChecking'
        };
        return mapping[functionName];
    }

    /**
     * 更新搜索框占位符
     */
    updateSearchPlaceholder(functionName) {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        const placeholders = {
            'intelligent-reading': '输入文本、上传文件或链接，开始智能伴读...',
            'comprehensive-analysis': '上传内容进行全面分析...',
            'expert-analysis': '选择大师角色，分析您的内容...',
            'fact-checking': '上传内容进行真伪鉴定...'
        };

        searchInput.placeholder = placeholders[functionName] || '请输入您的问题...';
    }

    /**
     * 显示功能说明
     */
    showFunctionDescription(functionName) {
        const descriptions = {
            'intelligent-reading': '🤖 智能伴读模式：我将帮助您深入理解内容，随时解答疑问',
            'comprehensive-analysis': '📊 全面总结模式：将对内容进行概要、细节、思考、总结四步分析',
            'expert-analysis': '👨‍🎓 大师分析模式：可选择不同角色视角来分析内容',
            'fact-checking': '🔍 真伪鉴定模式：将验证内容的真实性和可信度'
        };

        const description = descriptions[functionName];
        if (description) {
            showNotification(description, 'info', 3000);
        }
    }

    /**
     * 是否在切换功能时清空聊天
     */
    shouldClearChatOnSwitch(functionName) {
        // 智能伴读模式保留聊天历史，其他模式清空
        return functionName !== 'intelligent-reading';
    }

    /**
     * 清空聊天消息
     */
    clearChatMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
    }

    /**
     * 处理搜索/发送
     */
    async handleSearch() {
        console.log('=== 开始处理搜索请求 ===');
        
        if (!this.currentFunction) {
            console.log('错误：未选择功能模块');
            showNotification('请先选择一个功能模块', 'warning');
            return;
        }
        console.log('当前功能模块:', this.currentFunction);

        const searchInput = document.getElementById('searchInput');
        const query = searchInput?.value.trim();
        console.log('搜索输入框内容:', query);

        if (!query && !uploadManager?.hasUploadedContent()) {
            console.log('错误：没有输入内容且没有上传内容');
            showNotification('请输入内容或上传文件', 'warning');
            return;
        }

        // 检查登录状态
        console.log('检查登录状态，当前用户:', this.currentUser);
        if (!this.currentUser) {
            console.log('用户未登录，显示登录提示');
            showNotification('请先登录后使用', 'warning');
            authManager?.showAuthModal('login');
            return;
        }

        try {
            console.log('=== 准备切换到聊天界面 ===');
            // 切换到聊天界面          
            console.log('=== 准备请求数据 ===');
            // 准备请求数据
            const requestData = await this.prepareRequestData(query);
            console.log('请求数据:', requestData);

            console.log('=== 根据功能调用处理函数 ===');
            // 根据当前功能调用相应的处理函数
            switch (this.currentFunction) {
                case 'intelligent-reading':
                    // 对于智能伴读，我们显示聊天界面（这是正确的）
                    this.showChatInterface();
                    console.log('调用智能伴读处理');
                    await this.handleIntelligentReading(requestData);
                    break;
                
                // 对于其他三个功能，我们显示进度分析界面
                case 'comprehensive-analysis':
                case 'expert-analysis':
                case 'fact-checking':
                    console.log(`调用 ${this.currentFunction} 的进度分析处理`);
                    // 检查 progressManager 是否存在
                    if (window.progressManager) {
                        // 直接调用 progressManager 的 startAnalysis，它会负责显示进度界面
                        window.progressManager.startAnalysis(this.currentFunction);
                        // 你的实际API调用和流式数据处理会在这里触发
                        // 并将数据传递给 progressManager.handleStreamData()
                    } else {
                        showNotification('错误：进度管理器未初始化', 'error');
                    }
                    break;
                    
                default:
                    console.log('未知的功能模块:', this.currentFunction);
                    showNotification('未知的功能模块', 'error');
            }

            console.log('=== 清空输入框 ===');
            // 清空输入框
            if (searchInput) {
                searchInput.value = '';
                this.adjustTextareaHeight(searchInput);
            }

        } catch (error) {
            console.error('处理搜索请求失败:', error);
            showNotification('处理请求失败，请重试', 'error');
        }
    }

    /**
     * 准备请求数据
     */
    async prepareRequestData(query) {
        console.log('准备请求数据，输入query:', query);
        
        const data = {
            text: query || '',
            timestamp: new Date().toISOString()
        };

        console.log('基础数据结构:', data);

        // 添加上传的内容
        if (uploadManager?.hasUploadedContent()) {
            console.log('检测到上传内容，获取上传数据...');
            const uploadedData = uploadManager.getUploadedData();
            console.log('上传数据:', uploadedData);
            Object.assign(data, uploadedData);
        } else {
            console.log('没有上传内容');
        }

        console.log('最终请求数据:', data);
        return data;
    }

    /**
     * 处理智能伴读
     */
    async handleIntelligentReading(data) {
        console.log('=== 开始处理智能伴读 ===');
        console.log('处理数据:', data);
        
        if (chatManager) {
            console.log('chatManager 存在，开始处理...');
            // 设置当前功能
            chatManager.setCurrentFunction('intelligent-reading');
            console.log('已设置当前功能为 intelligent-reading');
            
            // 发送初始消息
            console.log('准备发送初始消息:', data.text || '');
            await chatManager.sendMessage(data.text || '', true);
            console.log('初始消息发送完成');
        } else {
            console.error('chatManager 不存在！');
            showNotification('聊天管理器未初始化', 'error');
        }
    }

    /**
     * 处理全面分析
     */
    async handleComprehensiveAnalysis(data) {
        if (chatManager) {
            // 设置当前功能
            chatManager.setCurrentFunction('comprehensive-analysis');
            // 发送初始消息
            await chatManager.sendMessage(data.text || '', true);
        }
    }

    /**
     * 处理大师分析
     */
    async handleExpertAnalysis(data) {
        if (chatManager) {
            // 设置当前功能
            chatManager.setCurrentFunction('expert-analysis');
            // 发送初始消息
            await chatManager.sendMessage(data.text || '', true);
        }
    }

    /**
     * 处理真伪鉴定
     */
    async handleFactChecking(data) {
        if (chatManager) {
            // 设置当前功能
            chatManager.setCurrentFunction('fact-checking');
            // 发送初始消息
            await chatManager.sendMessage(data.text || '', true);
        }
    }

    /**
     * 显示角色选择器
     */
    showRoleSelector() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content role-selector">
                    <div class="modal-header">
                        <h3>选择分析角色</h3>
                        <button class="close-btn" onclick="this.closest('.modal-overlay').remove(); resolve(null);">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="role-grid">
                            <div class="role-item" data-role="鲁迅">
                                <div class="role-avatar">🖋️</div>
                                <div class="role-name">鲁迅</div>
                                <div class="role-desc">犀利的文学批判家</div>
                            </div>
                            <div class="role-item" data-role="胡适">
                                <div class="role-avatar">📚</div>
                                <div class="role-name">胡适</div>
                                <div class="role-desc">理性的学者思辨</div>
                            </div>
                            <div class="role-item" data-role="可莉">
                                <div class="role-avatar">💥</div>
                                <div class="role-name">可莉</div>
                                <div class="role-desc">活泼的元素使者</div>
                            </div>
                            <div class="role-item" data-role="苏格拉底">
                                <div class="role-avatar">🤔</div>
                                <div class="role-name">苏格拉底</div>
                                <div class="role-desc">哲学的启发者</div>
                            </div>
                            <div class="role-item" data-role="爱因斯坦">
                                <div class="role-avatar">🧮</div>
                                <div class="role-name">爱因斯坦</div>
                                <div class="role-desc">科学的探索者</div>
                            </div>
                            <div class="role-item" data-role="自定义">
                                <div class="role-avatar">✨</div>
                                <div class="role-name">自定义</div>
                                <div class="role-desc">创建专属角色</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // 绑定角色选择事件
            modal.querySelectorAll('.role-item').forEach(item => {
                item.addEventListener('click', () => {
                    const role = item.dataset.role;
                    if (role === '自定义') {
                        const customRole = prompt('请输入自定义角色名称（如：马云、乔布斯等）:');
                        if (customRole) {
                            modal.remove();
                            resolve(customRole);
                        }
                    } else {
                        modal.remove();
                        resolve(role);
                    }
                });
            });

            document.body.appendChild(modal);
        });
    }

    /**
     * 切换简洁模式
     */
    toggleCompactMode() {
        const body = document.body;
        const isCompact = body.classList.toggle('compact-mode');
        
        localStorage.setItem('compactMode', isCompact.toString());
        showNotification(`已${isCompact ? '开启' : '关闭'}简洁模式`, 'info');

        // 更新按钮图标
        const toggleBtn = document.getElementById('compactModeToggle');
        const icon = toggleBtn?.querySelector('i');
        if (icon) {
            icon.className = `fas ${isCompact ? 'fa-expand' : 'fa-compress'}`;
        }
    }

    /**
     * 调整文本框高度
     */
    adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120); // 最大120px
        textarea.style.height = newHeight + 'px';
    }

    /**
     * 处理响应式布局
     */
    handleResponsive() {
        const width = window.innerWidth;
        const body = document.body;

        // 移动端适配
        if (width <= 768) {
            body.classList.add('mobile-mode');
        } else {
            body.classList.remove('mobile-mode');
        }

        // 平板适配
        if (width <= 1024 && width > 768) {
            body.classList.add('tablet-mode');
        } else {
            body.classList.remove('tablet-mode');
        }
    }

    /**
     * 处理键盘快捷键
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter 发送消息
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            this.handleSearch();
            return;
        }

        // Esc 关闭模态框
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal-overlay');
            if (modal) {
                modal.remove();
            }
            return;
        }

        // Ctrl/Cmd + K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
            return;
        }
    }

    /**
     * 处理页面可见性变化
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // 页面隐藏时的处理
            console.log('页面已隐藏');
        } else {
            // 页面显示时的处理
            console.log('页面已显示');
            // 检查认证状态
            this.checkAuthStatus();
        }
    }

    /**
     * 调试界面状态
     */
    debugInterfaceState() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        const chatScreen = document.getElementById('chatScreen');
        
        console.log('=== 当前界面状态 ===');
        if (welcomeScreen) {
            console.log('欢迎界面 style.display:', welcomeScreen.style.display);
            console.log('欢迎界面 computed display:', window.getComputedStyle(welcomeScreen).display);
        }
        
        if (chatScreen) {
            console.log('聊天界面 style.display:', chatScreen.style.display);
            console.log('聊天界面 computed display:', window.getComputedStyle(chatScreen).display);
        }
        
        // 添加到全局以便在控制台调用
        window.debugInterfaceState = () => this.debugInterfaceState();
    }

    // 这些方法已经由 authManager 统一管理，不再需要

    /**
     * 打开设置
     */
    openSettings() {
        showNotification('设置功能开发中...', 'info');
    }

    /**
     * 打开帮助
     */
    openHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'modal-overlay';
        helpModal.innerHTML = `
            <div class="modal-content help-modal">
                <div class="modal-header">
                    <h3>使用帮助</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove();">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="help-content">
                        <h4>🤖 智能伴读</h4>
                        <p>上传链接、图片、文档或直接输入文本，AI将帮助您深入理解内容</p>
                        
                        <h4>📊 全面总结</h4>
                        <p>AI将从概要、细节、思考、总结四个维度全面分析您的内容</p>
                        
                        <h4>👨‍🎓 大师分析</h4>
                        <p>选择不同的历史人物或角色，从独特视角分析内容</p>
                        
                        <h4>🔍 真伪鉴定</h4>
                        <p>验证内容的真实性，识别可能的虚假信息</p>
                        
                        <h4>快捷键</h4>
                        <ul>
                            <li><kbd>Ctrl</kbd> + <kbd>Enter</kbd>: 发送消息</li>
                            <li><kbd>Ctrl</kbd> + <kbd>K</kbd>: 聚焦搜索框</li>
                            <li><kbd>Esc</kbd>: 关闭弹窗</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
    }

    /**
     * 初始化默认状态
     */
    initDefaultState() {
        // 恢复简洁模式设置
        const isCompactMode = localStorage.getItem('compactMode') === 'true';
        if (isCompactMode) {
            document.body.classList.add('compact-mode');
            const toggleBtn = document.getElementById('compactModeToggle');
            const icon = toggleBtn?.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-expand';
            }
        }

        // 默认选择智能伴读功能
        this.switchFunction('intelligent-reading');
    }

    /**
     * 获取当前用户
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * 获取当前功能
     */
    getCurrentFunction() {
        return this.currentFunction;
    }

    /**
     * 获取应用配置
     */
    getConfig() {
        return this.config;
    }

    /**
     * 显示聊天界面
     */
    showChatInterface() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        const chatScreen = document.getElementById('chatScreen');
        
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
        
        if (chatScreen) {
            chatScreen.style.display = 'block';
            chatScreen.classList.add('fade-in');
        }
        
        // 清空欢迎界面的输入（保留搜索框的内容，因为要传递给聊天）
        if (window.uploadManager && typeof window.uploadManager.clearUploads === 'function') {
            window.uploadManager.clearUploads();
        }
    }
    
    /**
     * 检查移动端菜单状态
     */
    checkMobileMenuStatus() {
        setTimeout(() => {
            console.log('=== 移动端菜单状态检查 ===');
            console.log('window.mobileMenuManager:', window.mobileMenuManager);
            
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            
            console.log('mobileMenuToggle 元素:', mobileMenuToggle);
            console.log('mobileMenuOverlay 元素:', mobileMenuOverlay);
            
            if (mobileMenuToggle) {
                console.log('汉堡菜单按钮样式:', window.getComputedStyle(mobileMenuToggle).display);
                console.log('汉堡菜单按钮事件已绑定:', mobileMenuToggle.hasAttribute('data-event-bound'));
            }
            
            if (mobileMenuOverlay) {
                console.log('菜单覆盖层样式:', window.getComputedStyle(mobileMenuOverlay).display);
            }
            
            // 检查mobile-menu.js是否正确加载
            if (!window.mobileMenuManager) {
                console.warn('mobile-menu.js 可能未正确加载，将在1秒后重试初始化');
                setTimeout(() => {
                    if (window.MobileMenuManager && !window.mobileMenuManager) {
                        console.log('重新初始化移动端菜单管理器');
                        window.mobileMenuManager = new window.MobileMenuManager();
                    }
                }, 1000);
            }
        }, 500);
    }
}

// 全局应用实例
let app;

// 应用启动
document.addEventListener('DOMContentLoaded', () => {
    app = new AIReaderApp();
});

// 导出供其他模块使用
window.app = app;

// =======================================================
// 功能 #1: 刷新后保持顶部功能栏状态
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    // 同时获取桌面端和移动端的按钮
    const functionButtons = document.querySelectorAll('.function-btn, .mobile-function-btn');
    
    // 1. 页面加载时，尝试从 localStorage 恢复状态
    function restoreActiveTab() {
        const activeTabId = localStorage.getItem('activeFunctionTab');
        if (!activeTabId) return; // 如果没有保存的状态，直接退出

        // 找到要激活的按钮
        const buttonToActivate = document.getElementById(activeTabId);
        const mobileButtonToActivate = document.getElementById('mobile' + activeTabId.charAt(0).toUpperCase() + activeTabId.slice(1));
        
        if (buttonToActivate) {
            // 先移除所有按钮的 active 类
            functionButtons.forEach(btn => btn.classList.remove('active'));
            
            // 再激活正确的桌面端和移动端按钮
            buttonToActivate.classList.add('active');
            if (mobileButtonToActivate) {
                mobileButtonToActivate.classList.add('active');
            }

            // 【重要】调用 app 实例中已有的 switchFunction 方法来切换功能逻辑
            // 这样可以确保 placeholder 更新等所有相关逻辑都执行
            if (window.app && typeof window.app.switchFunction === 'function') {
                const functionName = buttonToActivate.dataset.function;
                if (functionName) {
                    window.app.switchFunction(functionName);
                }
            }
        }
    }

    // 2. 为每个功能按钮添加点击事件监听，以保存状态
    functionButtons.forEach(button => {
        // 我们监听 'mousedown' 而不是 'click'，确保在您原有的 click 事件之前执行
        button.addEventListener('mousedown', () => { 
            // 保存桌面端按钮的ID（作为统一标准）
            let buttonId = button.id;
            if (buttonId.startsWith('mobile')) {
                buttonId = buttonId.replace('mobile', '');
                buttonId = buttonId.charAt(0).toLowerCase() + buttonId.slice(1);
            }
            localStorage.setItem('activeFunctionTab', buttonId);
        });
    });

    // 3. 页面加载完成后立即执行恢复
    //    但有一个特殊情况：如果 progress.js 已经恢复了进度页面，
    //    我们就不应该强制切回到其他页面。
    const isProgressScreenActive = document.getElementById('progressScreen').style.display === 'block';
    if (!isProgressScreenActive) {
         restoreActiveTab();
    }
});
