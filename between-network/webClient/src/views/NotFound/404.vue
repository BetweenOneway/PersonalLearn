<template>
    <div class="not-found-wrapper">
        <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
            <template #footer>
                <n-button @click="goHome">回去吧，回到首页！</n-button>
            </template>
        </n-result>
    </div>
</template>

<script setup>
    import { toHerf } from '@/router/go'

    const goHome = () => {
        toHerf('/')
    }
</script>

<style scoped>
.not-found-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - var(--nav-bar-height));
}
</style>
