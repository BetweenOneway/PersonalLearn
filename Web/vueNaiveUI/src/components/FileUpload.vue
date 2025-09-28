<template>
    <div class="file-upload-container">
      <!-- 上传区域 -->
      <div 
        class="upload-area"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        :class="{ 'dragging-active': isDragging }"
      >
        <input 
          type="file" 
          class="file-input" 
          ref="fileInput" 
          @change="handleFileSelect"
          :multiple="multiple"
          :accept="accept"
        >
        
        <div class="upload-content">
          <i class="fas fa-cloud-upload-alt upload-icon"></i>
          <h3>拖放文件到这里上传</h3>
          <p>或者</p>
          <button class="browse-btn" @click="triggerFileSelect">浏览文件</button>
          <p class="file-types-info" v-if="accept">支持的格式: {{ formatAcceptText }}</p>
        </div>
      </div>
  
      <!-- 文件列表 -->
      <div class="file-list" v-if="files.length > 0">
        <h4>待上传文件</h4>
        <div class="file-item" v-for="(file, index) in files" :key="index">
          <div class="file-info">
            <i class="fas" :class="getFileIcon(file.name)"></i>
            <div>
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ formatFileSize(file.size) }}</div>
            </div>
          </div>
          
          <div class="file-actions">
            <!-- 进度条 -->
            <div class="progress-container" v-if="file.progress !== undefined">
              <div 
                class="progress-bar" 
                :style="{ width: file.progress + '%' }"
                :class="{ 
                  'progress-success': file.status === 'success',
                  'progress-error': file.status === 'error'
                }"
              ></div>
            </div>
            
            <!-- 状态图标 -->
            <i 
              class="fas status-icon"
              :class="{
                'fa-check text-green-500': file.status === 'success',
                'fa-exclamation-circle text-red-500': file.status === 'error',
                'fa-spinner fa-spin': file.status === 'uploading'
              }"
              v-if="file.status"
            ></i>
            
            <!-- 删除按钮 -->
            <button 
              class="delete-btn" 
              @click="removeFile(index)"
              :disabled="file.status === 'uploading'"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <!-- 上传按钮 -->
        <button 
          class="upload-all-btn" 
          @click="uploadAllFiles"
          :disabled="isUploading || files.length === 0"
        >
          <i class="fas fa-upload"></i>
          {{ isUploading ? '正在上传...' : '上传所有文件' }}
        </button>
      </div>
    </div>
  </template>
  
<script setup>
    import { ref, computed, onMounted } from 'vue';
  
     //  props
    const props = defineProps(
        {
            // 是否允许多文件上传
            multiple: {
                type: Boolean,
                default: true
            },
            // 接受的文件类型
            accept: {
                type: String,
                default: ''
            },
            // 最大文件大小(MB)
            maxSize: {
                type: Number,
                default: 10
            }
        }
    );
  
    // 状态管理
    const fileInput = ref(null);
    const files = ref([]);
    const isDragging = ref(false);
    const isUploading = ref(false);
  
    // 格式化接受的文件类型文本显示
    const formatAcceptText = computed(() => {
        if (!props.accept) return '所有文件';
        console.log("props.accept=>",props.accept)
        return props.accept
        .split(',')
        .map(type => {
            if (type.startsWith('.')) return type.toUpperCase();
            if (type.startsWith('image/')) return `${type.split('/')[1].toUpperCase()} 图片`;
            if (type.startsWith('video/')) return `${type.split('/')[1].toUpperCase()} 视频`;
            if (type.startsWith('audio/')) return `${type.split('/')[1].toUpperCase()} 音频`;
            return type;
        })
        .join(', ');
    });
  
    // 处理文件拖放
    const handleDrop = (e) => {
        isDragging.value = false;
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length) {
        addFiles(droppedFiles);
        }
    };
  
    // 触发文件选择对话框
    const triggerFileSelect = () => {
        fileInput.value.click();
    };
  
    // 处理文件选择
    const handleFileSelect = (e) => {
        console.log("handle file select")
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length) {
            addFiles(selectedFiles);
            // 重置input值，以便可以重复选择同一文件
            e.target.value = '';
        }
    };
  
    // 添加文件到列表
    const addFiles = (newFiles) => {
        newFiles.forEach(file => {
                // 检查文件大小
                if (file.size > props.maxSize * 1024 * 1024) {
                    alert(`文件 ${file.name} 太大，最大支持 ${props.maxSize}MB`);
                    return;
                }
                
                // 检查是否已存在相同文件
                const fileExists = files.value.some(f => 
                    f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
                );
                console.log("addFiles,file=>",file);
                if (!fileExists) {
                    // 使用Object.assign安全地复制File对象属性并添加自定义属性
                    const fileWithMetadata = file;
                    fileWithMetadata.progress = 0;
                    fileWithMetadata.status = null;
                    // Object.assign({}, file, {
                    //     progress: 0,
                    //     status: null // null, 'uploading', 'success', 'error'
                    // });
                    files.value.push(fileWithMetadata);
                }
            }
        );
        console.log("addFiles=>",files.value);
    };
  
    // 移除文件
    const removeFile = (index) => {
        files.value.splice(index, 1);
    };
  
    // 上传所有文件
    const uploadAllFiles = () => {
        if (files.value.length === 0) return;
        
        isUploading.value = true;
        
        // 为每个文件模拟上传过程
        files.value.forEach((file, index) => {
        file.status = 'uploading';
        file.progress = 0;
        
        simulateUpload(index);
        });
    };
  
    // 模拟上传过程
    const simulateUpload = (index) => {
        const file = files.value[index];
        if (!file || file.status !== 'uploading') return;
        
        // 随机增加进度
        const increment = Math.floor(Math.random() * 10) + 1;
        file.progress = Math.min(file.progress + increment, 100);
        
        // 进度未完成，继续模拟
        if (file.progress < 100) {
        setTimeout(() => simulateUpload(index), 200);
        } else {
        // 上传完成，随机成功或失败（实际应用中根据真实上传结果设置）
        file.status = Math.random() > 0.1 ? 'success' : 'error';
        
        // 检查是否所有文件都已上传
        checkAllUploaded();
        }
    };
  
    // 检查是否所有文件都已上传
    const checkAllUploaded = () => {
        const allUploaded = files.value.every(file => 
            file.status === 'success' || file.status === 'error'
        );
        
        if (allUploaded) {
            isUploading.value = false;
        }
    };
    
    // 格式化文件大小显示
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // 根据文件名获取对应的图标
    const getFileIcon = (fileName) => {
        console.log("getFileIcon=>",fileName);
        const ext = fileName.split('.').pop().toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext)) {
        return 'fa-file-image-alt text-green-500';
        } else if (['pdf'].includes(ext)) {
        return 'fa-file-pdf text-red-500';
        } else if (['doc', 'docx'].includes(ext)) {
        return 'fa-file-word text-blue-500';
        } else if (['xls', 'xlsx'].includes(ext)) {
        return 'fa-file-excel text-green-600';
        } else if (['ppt', 'pptx'].includes(ext)) {
        return 'fa-file-powerpoint text-orange-500';
        } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
        return 'fa-file-archive text-yellow-500';
        } else if (['mp3', 'wav', 'flac', 'aac'].includes(ext)) {
        return 'fa-file-audio text-purple-500';
        } else if (['mp4', 'avi', 'mov', 'mkv', 'flv'].includes(ext)) {
        return 'fa-file-video text-red-600';
        } else if (['txt', 'md', 'html', 'css', 'js', 'json', 'py', 'java', 'c', 'cpp'].includes(ext)) {
        return 'fa-file-code text-gray-700';
        } else {
        return 'fa-file text-gray-500';
        }
    };

    onMounted(()=>{
        console.log("props=>",props);
        console.log("formatAcceptText=>",formatAcceptText.value);
    })
</script>
  
<style scoped>
    .file-upload-container {
        max-width: 800px;
        margin: 2rem auto;
        padding: 1rem;
    }
    
    .upload-area {
        border: 2px dashed #ccc;
        border-radius: 8px;
        padding: 3rem 1rem;
        text-align: center;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
    }
    
    .upload-area.dragging-active {
        border-color: #4f46e5;
        background-color: rgba(79, 70, 229, 0.05);
    }
    
    .file-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }
    
    .upload-icon {
        font-size: 3rem;
        color: #4f46e5;
        margin-bottom: 1rem;
    }
    
    .upload-content h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
    }
    
    .upload-content p {
        color: #666;
        margin: 0.5rem 0;
    }
    
    .browse-btn {
        background-color: #4f46e5;
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 4px;
        margin: 1rem 0;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    
    .browse-btn:hover {
        background-color: #4338ca;
    }
    
    .file-types-info {
        font-size: 0.85rem;
        color: #888;
    }
    
    .file-list {
        margin-top: 2rem;
    }
    
    .file-list h4 {
        margin-bottom: 1rem;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
    }
    
    .file-item {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        border-radius: 4px;
        background-color: #f9fafb;
        margin-bottom: 0.5rem;
        justify-content: space-between;
    }
    
    .file-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
    }
    
    .file-info i {
        font-size: 1.5rem;
    }
    
    .file-name {
        font-weight: 500;
        color: #333;
    }
    
    .file-size {
        font-size: 0.85rem;
        color: #666;
    }
    
    .file-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 30%;
    }
    
    .progress-container {
        height: 8px;
        background-color: #e5e7eb;
        border-radius: 4px;
        flex: 1;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        background-color: #4f46e5;
        transition: width 0.3s ease;
    }
    
    .progress-success {
        background-color: #10b981;
    }
    
    .progress-error {
        background-color: #ef4444;
    }
    
    .status-icon {
        font-size: 1rem;
        width: 1.5rem;
        text-align: center;
    }
    
    .delete-btn {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .delete-btn:hover {
        color: #ef4444;
        background-color: rgba(239, 68, 68, 0.1);
    }
    
    .delete-btn:disabled {
        color: #ccc;
        cursor: not-allowed;
    }
    
    .delete-btn:disabled:hover {
        background-color: transparent;
    }
    
    .upload-all-btn {
        background-color: #4f46e5;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        margin-top: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .upload-all-btn:hover {
        background-color: #4338ca;
    }
    
    .upload-all-btn:disabled {
        background-color: #a5b4fc;
        cursor: not-allowed;
    }
</style>
  