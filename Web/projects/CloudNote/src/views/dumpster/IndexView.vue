<template>
    <n-layout content-style="padding:25px">
        <!--标题 操作按钮-->
        <n-space justify="space-between" align="center" style="margin-bottom:20px">
            <h3 style="margin:0">回收站</h3>
            <n-space>
                <n-button ghost type="success">批量回复</n-button>
                <n-button ghost type="error">批量彻底删除</n-button>
            </n-space>
        </n-space>
        <!--表格-->
        <n-data-table
            :columns="columns"
            :data="data"
        />
    </n-layout>
</template>

<script setup>
    import {NTag,NSpace,NButton} from 'naive-ui'

    //表格中的列
    const columns = [
        {
            type: "selection"
        },
        {
            title: "名称",
            key: "title"
        },
        {
            title: "类型",
            key: "type",
            render:row=>{
                //文件类型
                let type = row.type
                //颜色
                let color="success"
                //标签文本
                let label = "笔记"
                switch(type)
                {
                    case 1:
                        color="success"
                        label = "笔记"
                        break;
                    case 2:
                        color="info"
                        label = "笔记"
                        break;
                }
                //渲染成标签元素
                return h(
                    NTag,
                    {size:'small',bordered:false,type:color},
                    {defaault:()=>{label}}
                )
            }
        },
        {
            title: "时间",
            key: "updateTime"
        },
        {
            title: "操作",
            key: "action",
            render:row=>{
                //渲染成标签元素
                return h(
                    NSpace, null,
                    [
                        h(
                            NButton,
                            {size:'small',type:'success',tertiary:true},
                            {default:()=>"恢复"}
                        ),
                        h(
                            NButton,
                            {size:'small',type:'error',tertiary:true},
                            {default:()=>"彻底删除"}
                        )
                    ]
                )
            }
        }
    ];

    //表中的数据
    const data=ref([
        {
            title:"123",
            type:1,
            updateTime:'2024-09-30 11:11:11',
            action:''
        },
        {
            title:"456",
            type:2,
            updateTime:'2024-09-30 12:11:11',
            action:''
        },
    ])
</script>