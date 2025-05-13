<template>
    <n-button @click="goRouterView(1)">RouterView1</n-button>
    <n-button @click="goRouterView(2)">RouterView2</n-button>
    <n-button @click="ClearAll">Clear</n-button>
    <router-view />
</template>

<script setup>
     import { useRouter } from 'vue-router';
     const router = useRouter();

    function goRouterView(index)
    {
        switch(index)
        {
            case 1:
                router.push('/router/routerview1');
                break;
            case 2:
                router.push('/router/routerview2');
                break;
        }
    }

    function ClearAll()
    {
        router.push({ query: {} });
    }
</script>