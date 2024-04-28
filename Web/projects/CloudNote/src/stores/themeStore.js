import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import { darkTheme } from "naive-ui"
import { LightbulbOutlined,DarkModeRound } from '@vicons/material'

export const useThemeStore = defineStore(
    "theme",
    ()=>{
        //是否是暗系主题
        const isDarkTheme = ref(false);
        const theme = computed(()=>{
            if(isDarkTheme.value)
            {
                return {
                    name:darkTheme,
                    icon:LightbulbOutlined
                }
            }
            else{
                return {
                    name:null,
                    icon:DarkModeRound
                }
            }
        });

        //更改主题
        const changeTheme = dark=>{
            isDarkTheme.value = dark;
        }

        return {isDarkTheme,theme,changeTheme}
    },
    {
        persist: {
            storage:localStorage,//本地存储
            paths:["isDarkTheme"] //将isDarkTheme持久化保存
        }
    },
)
