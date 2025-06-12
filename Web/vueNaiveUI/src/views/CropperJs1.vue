<template>
    <ImageCropper1 @success="handleCropperSuccess" />
</template>
   
<script setup>
    import ImageCropper1 from '@/components/cropper/ImageCropper1.vue';

    function handleCropperSuccess()
    {
        
    }
</script>

<style scoped>
</style>