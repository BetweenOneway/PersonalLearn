/**
 * 禁用按钮/取消禁用按钮
 * @param {} btnDisabled 按钮disabled属性绑定的数据源
 * @param {Boolean} isDisabled 是否是禁用按钮
 * @param {boolean} isDelay 取消禁用按钮是否需要延迟
 * @param {Number} time 延迟的时间(s)
 */
export const disabledBtn = (btnDisabled,isDisabled,isDelay = false,time=0)=>{
    if(isDisabled)
    {
        btnDisabled.value = isDisabled;//禁用按钮
    }
    else{
        if(isDelay)
        {
            setTimeout(()=>{
                btnDisabled.value = isDisabled;
            },time*1000)
        }
        else{
            btnDisabled.value = isDisabled;//取消禁用
        }
    }
}