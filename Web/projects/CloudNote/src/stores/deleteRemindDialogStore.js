import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
    StickyNote2Outlined,
    EventNoteRound
} from "@vicons/material"

export const useDeleteRemindDialogStore = defineStore(
    "delete-remind-dialog",
    ()=>{
        //共享属性
        //是否显示
        const show = ref(false)
        //查看详情
        const showDetails = ref(false);
        //删除文件对象数组 {id,title,type,key}
        const files=ref([])
        //场景 1 正常场景 2 回收站场景
        const scene = ref(1)
        //删除权限 0 无权限 1删除权限 2 彻底删除权限 3 删除+彻底删除权限
        let deletePer = ref(3)

        /**
         * 默认窗口(scene)
         * @param {OBject} file 
         */
        const DefaultDeleteRemind = (file)=>{
            files.value[0] = file;
            show.value = true;
        }

        /**
         * 回收站单文件删除
         * @param {*} file 
         */
        const showFromDumpsterSingle = (file)=>{
            show.value = true;
            scene.value = 2;
            files.value[0] = file;
            deletePer = 2;
        }

        /**
         * 回收站多文件删除
         * @param {Array} multiFiles 
         */
        const showFromDumpsterMulti = (multiFiles)=>{
            files.value = multiFiles;
            show.value = true;
            scene.value = 2;
            deletePer = 2;
        }

        const reset = ()=>{
            show.value = false;
            showDetails.value = false;
            files.value=[];
            scene.value = 1;
            deletePer.value = 3;
        }

        //
        const fileArr = computed(()=>{
            //拷贝原数组对象
            const newFileArr = JSON.parse(JSON.stringify(files.value));
            newFileArr.forEach(element => {
                switch(element.type)
                {
                    case 1:
                        element.theme = 'success';
                        element.icon =StickyNote2Outlined;
                        element.tip='笔记'
                        break;
                    case 2:
                        element.theme = 'info';
                        element.icon =EventNoteRound;
                        element.tip='便签'
                        break;
                }
            });
            return newFileArr;
        });

        return {
            show,showDetails,files,scene,deletePer,fileArr,
            reset,DefaultDeleteRemind,
            showFromDumpsterSingle,showFromDumpsterMulti}
    }
)
