<template>
    <ImageCropper @success="handleCropperSuccess" />
</template>
   
<script setup>
    import ImageCropper from '@/components/cropper/ImageCropper1.vue';

    function handleCropperSuccess()
    {
        
    }
</script>

<style scoped>
</style>