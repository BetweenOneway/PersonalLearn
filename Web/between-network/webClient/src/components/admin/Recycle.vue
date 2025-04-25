<template>
    <n-layout content-style="padding:25px">
        <!--标题 操作按钮-->
        <n-space justify="space-between" align="center" style="margin-bottom:20px">
            <h3 style="margin:0">回收站</h3>
            <n-space>
                <n-button ghost type="success" @click="batchRestoreFiles">批量恢复</n-button>
                <n-button ghost type="error" @click="clickBatchDeleteBtn">批量彻底删除</n-button>
            </n-space>
        </n-space>
        <!--表格-->
        <n-data-table
            flex-height
            striped
            :columns="columns"
            :data="data"
            :pagination="pagination"
            v-model:checked-row-keys="rowChecked"
            @update:page="rowChecked=[]"
            style="height:calc(100% - 34px - 20px)"
        />
    </n-layout>
    <!--删除提醒框-->
    <DeleteRemindDialog @delete="getFileList" @remove="removeRowChecked"></DeleteRemindDialog>
</template>

<script setup>
    import { ref,computed,h } from 'vue';
    import {NTag,NSpace,NButton,NText, useMessage} from 'naive-ui'
    import noteServerRequest  from "@/request"
    import dumpsterApi from '@/request/api/dumpsterApi';
    import fileApi from '@/request/api/fileApi';
    import DeleteRemindDialog from "@/components/remind/DeleteRemindDialog.vue";
    import {useDeleteRemindDialogStore} from '@/stores/deleteRemindDialogStore'

    const deleteRemindDialogStore = useDeleteRemindDialogStore();
    const {showFromDumpsterSingle,showFromDumpsterMulti} = deleteRemindDialogStore;

    const message = useMessage();
    
    //表格中的列
    const columns = [
        {
            type: "selection"
        },
        {
            title: "名称",
            key: "title",
            render:row=>{
                let title = row.title;
                let depth = 1;//文字深度 颜色
                if(!title) 
                {
                    title="未设置文件名称"
                    depth = 3;
                }
                return h(NText,{depth},{default:()=>title})
            }
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
                        label = "便签"
                        break;
                }
                //渲染成标签元素
                return h(
                    NTag,
                    {size:'small',bordered:false,type:color},
                    {default:()=>label}
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
                //渲染成间距元素 按钮元素
                return h(
                    NSpace, null,
                    {default:()=>[
                        h(
                            NButton,
                            {
                                size:'small',type:'success',tertiary:true,
                                onClick:()=>{
                                    //恢复单文件
                                    restoreFile(row);
                                }
                            },
                            {default:()=>"恢复"}
                        ),
                        h(
                            NButton,
                            {
                                size:'small',type:'error',tertiary:true,
                                onClick:()=>{
                                    console.log("row=>",row);
                                    //显示删除提醒框
                                    showFromDumpsterSingle(row);
                                }
                            },
                            {default:()=>"彻底删除"}
                        )
                    ]}
                )
            }
        }
    ];

    //表中的数据
    const data=ref([])

    //分页配置
    const pagination = ref({
        pageSizes:[10,20,50],
        showSizePicker:true,
        size:'large'
    })

    //选中了哪些行
    const rowChecked = ref([]);

    //
    const getFileList = ()=>{
        //发送请求
        noteServerRequest(dumpsterApi.getFileList).then(responseData=>{
            if(!responseData) return;
            //回收站中的文件
            const files = responseData.data;
            //封装文件的key值（id:type）
            files.forEach(item=>{
                item.key = item.id+':'+item.type;
            });
            //显示回收站中的文件
            data.value = files;
            //整理被勾选的记录
            clearRowChecked()
        });
    };

    getFileList();

    //批量删除
    const clickBatchDeleteBtn = ()=>{
        let numOfToDelete = rowChecked.value.length;
        switch(numOfToDelete)
        {
            case 0:
                throw message.warning("未勾选任何文件");
                break;
            case 1:
                showFromDumpsterSingle(checkedRowsObjects.value[0]);
                break;
            default:
                showFromDumpsterMulti(checkedRowsObjects.value);
                break;
        }
    }

    /**
     * 恢复文件
     */
     const restoreFile = (file)=>{

        let files = [];
        files[0] = file;

        let API = {...dumpsterApi.restoreFiles};

        API.name = API.name[0];

        API.data = {
            files:files
        }

        //发送请求
        noteServerRequest(API).then(responseData=>{
            if(!responseData) return;
            //重新获取回收站中文件列表
            getFileList();
        });
    };

    /**
     * 批量恢复文件
     */
    const batchRestoreFiles = ()=>{

        const length = rowChecked.value.length;
        if(length === 0) throw message.warning('未选择任何文件')

        let API = {...fileApi.restoreFiles};

        API.name = length === 1 ? API.name[0]:API.name[1];

        API.data = {
            files:checkedRowsObjects.value
        }

        //发送请求
        noteServerRequest(API).then(responseData=>{
            if(!responseData) return;
            //重新获取回收站中文件列表
            getFileList();
        });
    };

    /**
     * 表格中勾选状态发生改变
     */
    const checkedRowsObjects = computed(()=>{
        return data.value.filter(item =>{
            return rowChecked.value.indexOf(item.key) !== -1;
        })
    });

    /**
     * 清除无效数据
     */
    const clearRowChecked = ()=>{
        let keys = [];
        data.value.forEach(item=>{
            if(rowChecked.value.indexOf(item.key) !== -1)
            {
                keys.push(item.key)
            }
        })

        rowChecked.value = keys;
    }

    //指定文件取消勾选
    const removeRowChecked = (key)=>{
        rowChecked.value = rowChecked.value.filter(item=> item !== key);
    }
</script>