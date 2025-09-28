<template>
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <!-- 页面标题 -->
        <header class="text-center mb-10">
            <h1 class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-gray-800 mb-2">
                <i class="fa fa-file-text-o text-primary mr-3"></i>Vue3文件处理工具
            </h1>
            <p class="text-gray-600 max-w-2xl mx-auto">
                文件上传、读取和保存示例
            </p>
        </header>
        
        <main>
            <!-- 文件上传区域 -->
            <section class="bg-white rounded-xl shadow-md p-6 mb-8 transform hover:shadow-lg transition-all duration-300 ease-in-out">
                <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fa fa-upload text-primary mr-2"></i>文件上传
                </h2>
                
                <!-- 拖放上传区域 -->
                <div 
                    id="fileDropArea" 
                    class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ease-in-out hover:border-primary"
                    @dragover.prevent="handleDragOver"
                    @dragleave.prevent="handleDragLeave"
                    @drop.prevent="handleDrop"
                    @click="triggerFileInput"
                >
                    <input 
                        type="file" 
                        ref="fileInput" 
                        class="hidden" 
                        @change="handleFileSelect"
                        accept=".txt,.html,.css,.js,.json,.md"
                    >
                    
                    <i class="fa fa-file-o text-5xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600 mb-2">拖放文件到此处，或点击选择文件</p>
                    <p class="text-sm text-gray-500">支持的格式: TXT, HTML, CSS, JS, JSON, MD</p>
                </div>
                
                <!-- 已上传文件信息 -->
                <div v-if="selectedFile" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <i class="fa fa-file-text text-primary mr-3 text-xl"></i>
                            <div>
                                <p class="font-medium text-gray-800 truncate max-w-md">{{ selectedFile.name }}</p>
                                <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }} • {{ selectedFile.type || '未知类型' }}</p>
                            </div>
                        </div>
                        <button 
                            @click="clearFile" 
                            class="text-gray-500 hover:text-red-500 transition-all duration-300 ease-in-out"
                            title="移除文件"
                        >
                            <i class="fa fa-times-circle"></i>
                        </button>
                    </div>
                </div>
            </section>
            
            <!-- 文件内容区域 -->
            <section class="bg-white rounded-xl shadow-md p-6 mb-8 transform hover:shadow-lg transition-all duration-300 ease-in-out">
                <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fa fa-file-text text-primary mr-2"></i>文件内容
                </h2>
                
                <div v-if="!fileContent" class="text-center py-10 text-gray-500">
                    <p v-if="selectedFile">请点击"读取文件"按钮查看文件内容</p>
                    <p v-else>请先上传文件</p>
                </div>
                
                <div v-if="fileContent">
                    <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <div class="text-sm text-gray-500">
                            字符数: {{ fileContent.length }}
                        </div>
                        <div class="flex gap-2">
                            <button 
                                @click="copyToClipboard" 
                                class="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 ease-in-out hover:bg-gray-700"
                                title="复制到剪贴板"
                            >
                                <i class="fa fa-copy mr-2"></i>复制内容
                            </button>
                            <button 
                                @click="saveFile" 
                                class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 ease-in-out hover:bg-green-700"
                                :disabled="saving"
                            >
                                <i class="fa fa-download mr-2"></i>
                                <span v-if="!saving">保存到本地</span>
                                <span v-if="saving"><i class="fa fa-spinner fa-spin mr-2"></i>保存中...</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="relative">
                        <pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-auto max-h-[400px] text-sm font-mono"><code>{{ fileContent }}</code></pre>
                    </div>
                </div>
                
                <div class="mt-4" v-if="selectedFile && !fileContent">
                    <button 
                        @click="readFile" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 ease-in-out hover:bg-blue-700"
                        :disabled="reading"
                    >
                        <i class="fa fa-eye mr-2"></i>
                        <span v-if="!reading">读取文件</span>
                        <span v-if="reading"><i class="fa fa-spinner fa-spin mr-2"></i>读取中...</span>
                    </button>
                </div>
            </section>
            
            <!-- 状态提示区域 -->
            <div 
                v-if="message" 
                class="fixed bottom-5 right-5 p-4 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out"
                :class="[
                    message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
                    message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
                    'bg-blue-50 text-blue-800 border border-blue-200'
                ]"
            >
                <div class="flex items-center">
                    <i 
                        class="mr-3"
                        :class="[
                            message.type === 'success' ? 'fa fa-check-circle text-green-500' : 
                            message.type === 'error' ? 'fa fa-exclamation-circle text-red-500' : 
                            'fa fa-info-circle text-blue-500'
                        ]"
                    ></i>
                    <p>{{ message.text }}</p>
                </div>
            </div>
        </main>
        
        <footer class="text-center text-gray-500 text-sm mt-12">
            <p>Vue3文件处理示例 &copy; {{ currentYear }}</p>
        </footer>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 响应式变量
const selectedFile = ref(null);
const fileContent = ref(null);
const reading = ref(false);
const saving = ref(false);
const message = ref(null);
const fileInput = ref(null);
const currentYear = computed(() => new Date().getFullYear());

// 触发文件选择对话框
const triggerFileInput = () => {
    fileInput.value.click();
};

// 处理文件选择
const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        fileContent.value = null; // 重置文件内容
        showMessage('info', `已选择文件: ${file.name}`);
    }
};

// 处理拖放事件 - 拖拽进入
const handleDragOver = () => {
    document.getElementById('fileDropArea').classList.add('border-primary', 'bg-blue-50');
};

// 处理拖放事件 - 拖拽离开
const handleDragLeave = () => {
    document.getElementById('fileDropArea').classList.remove('border-primary', 'bg-blue-50');
};

// 处理拖放事件 - 放置文件
const handleDrop = (event) => {
    document.getElementById('fileDropArea').classList.remove('border-primary', 'bg-blue-50');
    
    const file = event.dataTransfer.files[0];
    if (file) {
        selectedFile.value = file;
        fileContent.value = null; // 重置文件内容
        // 清空input值，允许重复上传同一文件
        fileInput.value.value = '';
        showMessage('info', `已选择文件: ${file.name}`);
    }
};

// 清除已选择的文件
const clearFile = () => {
    selectedFile.value = null;
    fileContent.value = null;
    fileInput.value.value = '';
    showMessage('info', '已移除文件');
};

// 读取文件内容
const readFile = () => {
    if (!selectedFile.value) return;
    
    reading.value = true;
    const reader = new FileReader();
    
    reader.onload = (event) => {
        fileContent.value = event.target.result;
        reading.value = false;
        showMessage('success', '文件读取成功');
    };
    
    reader.onerror = () => {
        reading.value = false;
        showMessage('error', '文件读取失败');
        console.error('读取错误:', reader.error);
    };
    
    // 根据文件类型选择适当的读取方式
    if (selectedFile.value.type.includes('text') || 
        ['json', 'js', 'css', 'html', 'md'].some(ext => 
            selectedFile.value.name.toLowerCase().endsWith(`.${ext}`)
        )) {
        reader.readAsText(selectedFile.value);
    } else {
        // 如果不是文本文件，尝试以DataURL方式读取
        reader.readAsDataURL(selectedFile.value);
    }
};

// 保存文件到本地
const saveFile = () => {
    if (!fileContent.value || !selectedFile.value) return;
    
    saving.value = true;
    
    try {
        // 创建Blob对象
        const blob = new Blob([fileContent.value], { 
            type: selectedFile.value.type || 'text/plain' 
        });
        
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFile.value.name;
        
        // 触发下载
        document.body.appendChild(a);
        a.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            saving.value = false;
            showMessage('success', '文件已保存到本地');
        }, 100);
    } catch (error) {
        saving.value = false;
        showMessage('error', '文件保存失败');
        console.error('保存错误:', error);
    }
};

// 复制内容到剪贴板
const copyToClipboard = () => {
    if (!fileContent.value) return;
    
    navigator.clipboard.writeText(fileContent.value)
        .then(() => {
            showMessage('success', '内容已复制到剪贴板');
        })
        .catch(err => {
            showMessage('error', '复制失败，请手动复制');
            console.error('复制错误:', err);
        });
};

// 显示提示消息
const showMessage = (type, text) => {
    message.value = { type, text };
    
    // 3秒后自动隐藏消息
    setTimeout(() => {
        message.value = null;
    }, 3000);
};

// 格式化文件大小
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>
