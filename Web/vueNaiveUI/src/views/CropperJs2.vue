<template>
    <ImageCropper @success="handleCropperSuccess" />
</template>
   
<script setup>
    import ImageCropper from '@/components/cropper/ImageCropper2.vue';

    function handleCropperSuccess()
    {
        
    }
</script>

<style scoped>
</style>