<template>
    <div class="container pt-6 pb-6">
        <el-row align="middle">
            <el-col :span="12">
                <h1 class="caption">云笔记</h1>
                <p>任何时间 任何地点 任何设备 一触即达</p>
                <el-button type="primary" size="large">开始使用</el-button>
            </el-col>
            <el-col :span="12">
                <el-image :src="illustration3"></el-image>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
    import illustration3 from '@/assets/img/illustrations/illustration-3.svg'
</script>

<style scoped>
@import url('@/assets/main.css');
.pt-6 {
    padding-top:6rem;
}
.pb-6 {
    padding-bottom:6rem;
}
.caption{
    font-size:80px;
    font-weight: 900;
    line-height: 1;
}
</style>
