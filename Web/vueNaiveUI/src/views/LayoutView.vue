<template>
    <div style="height: 100vh;">
        <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
        <div class="h-full overflow-hidden" :class="getMobileClass">
            <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
            <Sider />
            <NLayoutContent class="h-full">
                <div>
                    <h2 style="position: absolute;background-color: #fff;width: 100%;height: 50px;border: 1px solid black;">标题</h2>
                    <div >
                        <h2 >内容2</h2>
                        <h2 v-for="i in 50">内容1</h2>
                    </div>
                </div>
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