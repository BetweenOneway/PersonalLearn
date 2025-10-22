<template>
    <h1 class="new-color">Hello Component</h1>
    <!-- <SubComponent class="new-border"></SubComponent> -->
     <SubComponent />
</template>

<script setup>
    import SubComponent from '@/components/SubComponent.vue';
</script>

<style scoped>
    :deep(h1) {
        font-size: 30px;
    }
    .new-color{
        color:red
    }
    .new-border{
        border:1px solid blue;
    }

    /*
    屏蔽input number上下箭头
    */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }
</style>