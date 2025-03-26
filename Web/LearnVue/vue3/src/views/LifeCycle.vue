<template>
    生命周期演示
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

    let isRefresh = false;

    const handleBeforeUnload = () => {
        console.log("before unload")
      if (!isRefresh) {
        localStorage.setItem('lifecycle','learn');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        isRefresh = true;
        console.log("F5")
      }
    };

    onMounted(() => {
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    });

    onUnmounted(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });

</script>