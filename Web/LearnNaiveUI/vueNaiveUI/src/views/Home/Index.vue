<template>
    <div class="container pt-6 pb-6">
        <n-grid>
            <n-grid-item :span="12">
                <h1 class="caption">云笔记</h1>
                <p class="desc mb-1">任何时间 任何地点 任何设备 一触即达</p>
                <n-button type="primary" size="large" class="mt-3" @click="toHerf('/note')">开始使用</n-button>
            </n-grid-item>
            <n-grid-item :span="12">
                <n-image width="100%" :src="illustration3"></n-image>
            </n-grid-item>
        </n-grid>
    </div>
</template>

<script setup>
    import illustration3 from '@/assets/img/illustrations/illustration-3.svg'
    import { toHerf } from '@/router/go';
</script>

<style scoped>
.container
{
    width: 100%;
    margin-right: auto;
    margin-left: auto; 
    padding-right: 15px;
    padding-left: 15px;
}

@media (min-width: 576px)
{
    .container
    {
        max-width: 540px;
    }
}
@media (min-width: 768px)
{
    .container
    {
        max-width: 720px;
    }
}
@media (min-width: 992px)
{
    .container
    {
        max-width: 960px;
    }
}
@media (min-width: 1200px)
{
    .container
    {
        max-width: 1140px;
    }
}

.pt-6 {
    padding-top:6rem;
}
.pb-6 {
    padding-bottom:6rem;
}
.mb-1{
    margin-bottom:1rem;
}
.mt-3{
    margin-top:3rem;
}
.caption{
    font-size:80px;
    font-weight: 900;
    line-height: 1;
}
.desc{
    font-size:1.125rem;
    font-weight: 300;
}
</style>