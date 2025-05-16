<template>
    <div style="height: 100vh;">
        <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
        <div class="h-full overflow-hidden" :class="getMobileClass">
            <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
            <Sider />
            <NLayoutContent class="h-full">
                <!-- <RouterView v-slot="{ Component, route }">
                <component :is="Component" :key="route.fullPath" />
                </RouterView> -->
            </NLayoutContent>
            </NLayout>
        </div>
        <Permission :visible="needPermission" />
        </div>
    </div>
</template>

<script setup>
    import { ref,computed } from 'vue';

    import Sider from '@/components/layout/Sider.vue';

    const isMobile = ref(false);
    const collapsed = ref(false);

    const getMobileClass = computed(() => {
    if (isMobile.value)
        return ['rounded-none', 'shadow-none']
    return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
    })

    const getContainerClass = computed(() => {
    return [
        'h-full',
        { 'pl-[260px]': !isMobile.value && !collapsed.value },
    ]
    })
</script>