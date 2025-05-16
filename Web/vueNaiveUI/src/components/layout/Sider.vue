<template>
    <n-layout-sider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
    >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
        <main class="flex flex-col flex-1 min-h-0">
            <div class="p-4">
                <NButton dashed block @click="handleAdd">
                    chat.newChatButton
                </NButton>
            </div>
            <div class="flex-1 min-h-0 pb-4 overflow-hidden">
                <List />
            </div>
            <div class="flex items-center p-4 space-x-4">
                <div class="flex-1">
                <NButton block @click="show = true">
                    store.siderButton
                </NButton>
                </div>
                <NButton @click="handleClearAll">
                    <SvgIcon icon="ri:close-circle-line" />
                </NButton>
            </div>
        </main>
        <Footer />
    </div>
    </n-layout-sider>
    <template v-if="isMobile">
        <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
    </template>
</template>

<script setup>
    import { ref,watch,computed } from 'vue';
    import Footer from './Footer.vue';
    import List from './List.vue';

    const collapsed= ref(false);
    const isMobile= ref(false);

    // watch(
    //     isMobile,
    //     (val) => {
    //         appStore.setSiderCollapsed(val)
    //     },
    //     {
    //         immediate: true,
    //         flush: 'post',
    //     },
    // )

    function handleUpdateCollapsed() {
        collapsed.value = true;
    }

    const getMobileClass = computed(() => {
        if (isMobile.value) {
            return {
            position: 'fixed',
            zIndex: 50,
            }
        }
        return {}
    })
</script>