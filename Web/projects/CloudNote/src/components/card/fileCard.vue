<template>
    <n-card embedded :bordered="false" size="small" hoverable>
        <n-space align="center" :wrap-item="false">
            <n-icon :size="32" :component="StickyNote2Outlined"></n-icon>
            <n-space vertical :size="4">
                <n-text>{{title}}</n-text>
                <n-text depth="3">{{time}}</n-text>
            </n-space>
        </n-space>
    </n-card>
</template>

<script setup>
    import { EventNoteRound,StickyNote2Outlined,ShoppingBagOutlined } from '@vicons/material';

    //自定义属性
    const props = defineProps(
        {
            id:{required:true,type:Number},
            title:{type:String,default:'未设置文件名'},
            type:{type:Number,required:true},
            time:{type:String,required:true}
        }
    );
</script>