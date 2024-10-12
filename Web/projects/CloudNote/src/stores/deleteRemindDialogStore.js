import { defineStore } from 'pinia'
import { computed, ref,watch } from 'vue'

export const deleteRemindDialogStore = defineStore(
    "delete-remind-dialog",
    ()=>{
        //共享属性
        //是否显示
        const show = ref(false)
        //删除的文件名
        const fileName=ref(null)
        //删除文件个数
        const size=ref(1)
        //是否显示删除按钮
        const deleteBtn = ref(true)
        //彻底删除按钮
        const completeDeleteBtn = ref(true)
        //删除的文件类型 1 笔记 2 便签
        const type =ref(1)

        /**
         * 默认窗口
         * @param {String} file 
         * @param {Number} fileType 
         */
        const showDefault = (file,fileType)=>{
            show.value = true;
            fileName.value = file;
            type.value = fileType;
        }

        /**
         * 笔记删除提醒框
         * @param {String} file 
         */
        const showFromNote = (file)=>{
            show.value = true;
            fileName.value = file;
            type.value = 1;
        }

        /**
         * 便签删除提醒框
         * @param {String} file 
         */
        const showFromMemo = (file)=>{
            show.value = true;
            fileName.value = file;
            type.value = 2;
        }

        /**
         * 回收站单文件删除
         * @param {*} file 
         * @param {*} fileType 
         */
        const showFromDumpsterSingle = (file,fileType)=>{
            show.value = true;
            fileName.value = file;
            type.value = fileType;
            deleteBtn.value = false;
        }

        /**
         * 回收站多文件删除
         * @param {*} numOfFiles 
         */
        const showFromDumpsterMulti = (numOfFiles)=>{
            size.value = numOfFiles;
            show.value = true;
        }

        const reset = ()=>{
            fileName.value = null;
            size.value = 1;
            deleteBtn.value = true;
            completeDeleteBtn.value = true;
            type.value =1;
        }

        return {
            show,fileName,size,deleteBtn,completeDeleteBtn,type,
            showDefault,showFromNote,showFromMemo,
            showFromDumpsterSingle,showFromDumpsterMulti,
            reset}
    }
)
