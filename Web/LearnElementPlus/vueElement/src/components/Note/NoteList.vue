<template>
    <div class="note-list-container">
        <div>
            <el-input type="text" placeholder="搜索..." class="search-box" :suffix-icon="Search"/>
        </div>
        <el-scrollbar>
            <ul>
                <li v-for="note in noteList" :key="note.id" class="file-item">
                    <div class="file-title">
                        <el-icon :size="20" class="file-icon">
                            <Edit />
                        </el-icon>
                        <el-space style="flex:1">
                            <el-text class="title">{{note.title}}</el-text>
                        </el-space>
                        <el-icon>
                            <More/>
                        </el-icon>
                    </div>
                    <el-space class="file-info">
                        <span class="file-date">{{ note.updatedAt }}</span>
                        <span class="file-size">{{ note.fileSize }}</span>
                    </el-space>
                </li>
            </ul>
        </el-scrollbar>
    </div>
</template>

<script setup>
    import { Search, Edit,More } from '@element-plus/icons-vue'
    const noteList = [
        {
            id:1,
            title:'note 1',
            updatedAt:'2024-12-09',
            fileSize:'1KB'
        },
        {
            id:2,
            title:'note 2',
            updatedAt:'2024-12-09',
            fileSize:'4KB'
        },
        {
            id:3,
            title:'note 3',
            updatedAt:'2024-12-09',
            fileSize:'4KB'
        },
        {
            id:4,
            title:'note 4',
            updatedAt:'2024-12-09',
            fileSize:'4KB'
        },
    ]
</script>

<style scoped>
.note-list-container{
    display: flex;
    flex-direction: column;
    padding:10px 0;
}

.search-box{
    cursor:pointer;
    border-radius: 6px;
    font-size: 17px;
    font-weight: 500;
    width: 100%;
    outline:none;
    border: none;
}

ul{
    list-style: none;
    margin: 0;
    padding: 0;
    border: 0;
}

.file-item{
    margin:0 11px 12px;
    padding: 13px 8px;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-top: 1px solid #f0f3f5;
}

.file-title{
    height: 22px;
    align-items: center;
    display: flex;
}

.file-icon{
    margin-right:15px;
}

.file-info{
    display: flex;
    align-items: center;
    margin:4px 0 0;
}
</style>