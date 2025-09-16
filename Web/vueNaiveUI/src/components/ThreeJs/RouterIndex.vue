
<template>
    <div>
        <h1>ThreeJs学习用例</h1>
        <n-flex>
            <n-card>
                <RouterLink :to="gotoHerf('basic-example')">基础示例</RouterLink>
            </n-card>
            <n-card>
                <RouterLink :to="gotoHerf('target-demo')">综合成果</RouterLink>
            </n-card>
        </n-flex>
    </div>
  </template>

<script setup>
    import { useRoute } from 'vue-router';
    const route = useRoute();

    function gotoHerf(url)
    {
        return route.path +'/' + url
    }
</script>