<template>
    <div style="width: 100%;">
        <n-grid x-gap="12" :y-gap="8" :cols="4">
            <n-gi v-for="(blogItem,index) in blogList" :key="blog.id" :data-index="index">
                <blog-card :blog="blogItem"/>
            </n-gi>
        </n-grid>
        <n-button>加载更多</n-button>
    </div>
</template>

<script setup>
    import BlogCard from '@/components/blog/BlogCard.vue';
    //公开笔记列表 也称为blog
    const blogList = ref([]);
</script>