import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStateStore = defineStore(
    "state",
    ()=>{
        //共享属性
        //是否显示
        const show = ref(false)
        
        const toggleShow = ()=>{
            console.log("change show state=>",show.value)
            show.value = !show.value;
        }

        return {show,toggleShow}
    }
)