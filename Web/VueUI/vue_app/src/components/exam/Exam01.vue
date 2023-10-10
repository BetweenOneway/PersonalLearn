<template>
    <div>
        <h3>Exam01.vue</h3>
    </div>
</template>

<script>
export default{
    created(){
        //vue组件生命周期事件，表示当前组件创建成功 立即调用函数
        //默认3s后消失
        this.$toast({message:"组件创建成功"});
    },
}
</script>