<template>
    <el-space direction="vertical">
        <el-input type="text" placeholder="搜索..." class="search-box" :suffix-icon="Search"/>
        <el-space direction="vertical" style="width:100%">
            <el-space v-for="note in noteList" :key="note.id" fill>
                <el-card style="width: 100%;">
                    <template #header>
                        <div class="card-header">
                            <span>note.title</span>
                        </div>
                    </template>
                </el-card>
            </el-space>
        </el-space>
    </el-space>
</template>

<script setup>
    import { Search } from '@element-plus/icons-vue'
    const noteList = [
        {
            id:1,
            title:'note 1'
        },
        {
            id:2,
            title:'note 2'
        },
    ]
</script>

<style scoped>
.search-box{
    cursor:pointer;
    border-radius: 6px;
    font-size: 17px;
    font-weight: 500;
    height: 100%;
    width: 100%;
    outline:none;
    border: none;
}
</style>