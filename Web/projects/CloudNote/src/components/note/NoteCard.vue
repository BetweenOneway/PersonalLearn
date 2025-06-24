<template>
    <n-thing class="note-card">
        <!--标题-->
        <template #header>
            <n-ellipsis line-clamp="1" v-if="!rename">
                {{title}}
            </n-ellipsis>
        </template>
        <!--笔记内容-->
        <template #description>
            <n-space vertical>
                <!--阻止重命名点击事件的冒泡行为-->
                <!--失去焦点或者单按回车-->
                <n-input autofocus :default-value="title" 
                    @click.stop 
                    @keydown.enter.exact="toRenameAction" 
                    @blur="emits('cancelRename',{id})" 
                    v-if="rename" style="width:100%">
                </n-input>
                <n-ellipsis line-clamp="2" :tooltip="false">
                    <n-text depth="3">
                        {{htmlToText(desc)}}
                    </n-text>
                </n-ellipsis>
            </n-space>
            
        </template>
        <!--底部状态栏-->
        <template #default>
            <n-space align="center" :size="8">
                <n-tag v-if="top" type="primary" size="small" :bordered="false">置顶</n-tag>
                <n-divider vertical v-if="top"></n-divider>
                <n-text depth="3">{{time}}</n-text>
            </n-space>
        </template>
    </n-thing>
</template>

<script setup>
    import {htmlToText} from"html-to-text"

    const props = defineProps(
        {
            id:{type:Number,required:true},//编号
            title:{type:String,required:true},//标题
            desc:{type:String,default:()=>'暂无内容'},//简介
            top:{type:Boolean,required:false},//是否置顶
            time:{type:String,required:true},//修改时间
            rename:{type:Boolean,default:false}
        }
    )

    const emits = defineEmits(['rename','cancelRename']);

    const toRenameAction = e =>{
        const newName = e.target.value;
        //触发重命名事件
        emits('rename',
            {
                id:props.id,
                title:newName,
            }
        )
    }
</script>

<style>
    /*
    解决笔记列表换行问题
    */
    .n-thing.note-card{
        word-break:break-all;
    }
</style>