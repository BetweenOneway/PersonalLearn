<template>
    <FileUpload 
    :multiple="true" 
    accept="image/*,.pdf,.doc,.docx,text/plain" 
    :maxSize="20"
    />
</template>

<script setup>
    import FileUpload from '@/components/FileUpload.vue';
</script>