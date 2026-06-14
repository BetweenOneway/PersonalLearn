import dayjs from "dayjs"
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

//中文语言包
dayjs.locale('zh-cn')

//安装 相对时间插件
dayjs.extend(relativeTime)

/**
 * 日期距离当前时间多久 
 * @param {String} date 
 * @returns {String} 描述
 */
export const fromNow = (date)=>{
    const timeStr = dayjs(date).fromNow();
    return timeStr === "几秒前"?"刚刚":timeStr;
}
