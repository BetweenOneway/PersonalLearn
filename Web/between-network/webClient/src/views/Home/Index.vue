<template>
    <div class="container pt-6 pb-6">
        <n-flex justify="space-between" align="center" style="margin:0 auto" :wrap="false">
            <div style="flex: 1;">
                <h1 class="caption">云笔记</h1>
                <p class="desc mb-1">任何时间 任何地点 任何设备 一触即达</p>
                <n-button type="primary" size="large" class="mt-3" @click="toSpecifiedRoute('/note')">开始使用</n-button>
            </div>
            <div style="flex: 1;">
                <n-image width="100%" :src="illustration3"></n-image>
            </div>
        </n-flex>
        <div id="blogs" class="content-row">
            <div class="card-title">
                <span class="title">最近公开笔记</span>
                <a href="#" target="_blank" rel="noopener" class="link-more">
                    <span>更多</span>
                    <n-icon :component="KeyboardArrowRightFilled"/>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
    import illustration3 from '@/assets/img/illustrations/illustration-3.svg'
    import { toHerf } from '@/router/go';
    import { loginInvalid,getUserToken } from "@/Utils/userLogin";
    import {KeyboardArrowRightFilled} from "@vicons/material"

    async function toSpecifiedRoute(inputRoute,requiredLogin=true){
        if(requiredLogin)
        {
            let ret = await getUserToken()
            if(ret)
            {
                toHerf(inputRoute)
            }
        }
        else
        {
            toHerf(inputRoute)
        }
    }

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

    .content-row{
        margin-top: 40px;
    }
    .card-title {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        margin-bottom: 24px
    }
    .card-title .title {
        -ms-flex: 1 1;
        flex: 1 1;
        font-size: 22px;
        font-weight: 700
    }
    
    .card-title .link-more {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center
    }
    .card-title .link-more span {
        font-size: 16px;
        line-height: 16px
    }
</style>