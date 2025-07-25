<template>
    <n-card title="公开笔记">
        <template #header-extra>
            <a href="javascript:;">更多</a>
        </template>
        <n-grid x-gap="12" :y-gap="8" :cols="4">
            <n-gi>
                <div class="card-container">
                    <n-card hoverable>
                        <div class="flex">
                            <span>
                                <n-icon size="30">
                                    <CanadianMapleLeaf />
                                </n-icon>
                            </span>
                            <span class="ml-4 text-lg">原创笔记</span>
                        </div>
                        <div class="flex h-10 mt-2 text-gray-400">
                            是一个面向开源及私有软件项目的托管平台。
                        </div>
                        <div class="flex h-10 mt-2 text-gray-400"> 开源君，2021-07-04 </div>
                        <template #action>
                        #action
                        </template>
                    </n-card>
                </div>
            </n-gi>
            <n-gi>
                <n-card hoverable>
                    <template #header>
                        <div class="flex">
                            <span>
                                <n-icon size="30">
                                    <CanadianMapleLeaf />
                                </n-icon>
                            </span>
                            <span class="ml-4 text-lg">原创笔记2</span>
                        </div>
                    </template>
                    <template #default>
                    default内容
                    </template>
                    <template #footer>
                    #footer
                    </template>
                    <template #action>
                        <n-button quaternary circle>
                            <template #icon>
                                <n-icon>
                                    <HeartRegular/>
                                </n-icon>
                            </template>
                        </n-button>
                        <n-button quaternary circle>
                            <template #icon>
                                <n-icon>
                                    <ThumbsUpRegular/>
                                </n-icon>
                            </template>
                        </n-button>
                        <n-button quaternary circle>
                            <template #icon>
                                <n-icon>
                                    <ThumbsDownRegular/>
                                </n-icon>
                            </template>
                        </n-button>
                    </template>
                </n-card>
            </n-gi>
            <n-gi>
                <n-card hoverable>
                    <template #header>
                        <div class="flex">
                            <span>
                                <n-icon size="30">
                                    <CanadianMapleLeaf />
                                </n-icon>
                            </span>
                            <span class="ml-4 text-lg">原创笔记4</span>
                        </div>
                    </template>
                    <template #default>
                    default内容
                    </template>
                    <template #footer>
                        <n-button quaternary circle>
                            <template #icon>
                                <n-icon>
                                    <HeartRegular/>
                                </n-icon>
                            </template>
                        </n-button>
                        <n-button quaternary circle>
                            <template #icon>
                                <n-icon>
                                    <ThumbsUpRegular/>
                                </n-icon>
                            </template>
                        </n-button>
                        <n-button quaternary circle>
                            <template #icon>
                                <n-icon>
                                    <ThumbsDownRegular/>
                                </n-icon>
                            </template>
                        </n-button>
                    </template>
                </n-card>
            </n-gi>
            <n-gi>
                <n-card title="笔记标题4" hoverable>
                    内容
                    <template #footer>
                    #footer
                    </template>
                    <template #action>
                    #action
                    </template>
                </n-card>
            </n-gi>
            <n-gi>
                <n-thing>
                    <template #avatar>
                        <n-avatar>
                            <n-icon>
                                <DollarSign />
                            </n-icon>
                        </n-avatar>
                    </template>
                    <template #header>
                    货币
                    </template>
                    <template #header-extra>
                        <n-button circle size="small">
                            <template #icon>
                                <DollarSign />
                            </template>
                        </n-button>
                    </template>
                    <template #description>
                    描述
                    </template>
                    货币是为了提高交易效率而用于交换的中介商品。货币有多种形式，如贝壳粮食等自然物、金属纸张等加工品、银行卡信用卡等磁条卡、移动支付加密货币等APP。
                    <template #footer>
                    尾部
                    </template>
                    <template #action>
                        <n-space>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            1 块钱
                            </n-button>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            10 块钱
                            </n-button>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            100 块钱
                            </n-button>
                        </n-space>
                    </template>
                </n-thing>
            </n-gi>
            <n-gi>
                <n-thing>
                    <template #avatar>
                        <n-avatar>
                            <n-icon>
                                <DollarSign />
                            </n-icon>
                        </n-avatar>
                    </template>
                    <template #header>
                    货币
                    </template>
                    <template #header-extra>
                        <n-button circle size="small">
                            <template #icon>
                                <DollarSign />
                            </template>
                        </n-button>
                    </template>
                    <template #description>
                    描述
                    </template>
                    货币是为了提高交易效率而用于交换的中介商品。货币有多种形式，如贝壳粮食等自然物、金属纸张等加工品、银行卡信用卡等磁条卡、移动支付加密货币等APP。
                    <template #footer>
                    尾部
                    </template>
                    <template #action>
                        <n-space>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            1 块钱
                            </n-button>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            10 块钱
                            </n-button>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            100 块钱
                            </n-button>
                        </n-space>
                    </template>
                </n-thing>
            </n-gi>
            <n-gi>
                <n-thing>
                    <template #avatar>
                        <n-avatar>
                            <n-icon>
                                <DollarSign />
                            </n-icon>
                        </n-avatar>
                    </template>
                    <template #header>
                    货币
                    </template>
                    <template #header-extra>
                        <n-button circle size="small">
                            <template #icon>
                                <DollarSign />
                            </template>
                        </n-button>
                    </template>
                    <template #description>
                    描述
                    </template>
                    货币是为了提高交易效率而用于交换的中介商品。货币有多种形式，如贝壳粮食等自然物、金属纸张等加工品、银行卡信用卡等磁条卡、移动支付加密货币等APP。
                    <template #footer>
                    尾部
                    </template>
                    <template #action>
                        <n-space>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            1 块钱
                            </n-button>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            10 块钱
                            </n-button>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            100 块钱
                            </n-button>
                        </n-space>
                    </template>
                </n-thing>
            </n-gi>
            <n-gi>
                <n-thing>
                    <template #avatar>
                        <n-avatar>
                            <n-icon>
                                <DollarSign />
                            </n-icon>
                        </n-avatar>
                    </template>
                    <template #header>
                    货币
                    </template>
                    <template #header-extra>
                        <n-button circle size="small">
                            <template #icon>
                                <DollarSign />
                            </template>
                        </n-button>
                    </template>
                    <template #description>
                    描述
                    </template>
                    货币是为了提高交易效率而用于交换的中介商品。货币有多种形式，如贝壳粮食等自然物、金属纸张等加工品、银行卡信用卡等磁条卡、移动支付加密货币等APP。
                    <template #footer>
                    尾部
                    </template>
                    <template #action>
                        <n-space>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            1 块钱
                            </n-button>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            10 块钱
                            </n-button>
                            <n-button size="small">
                            <template #icon>
                                <n-icon>
                                <DollarSign />
                                </n-icon>
                            </template>
                            100 块钱
                            </n-button>
                        </n-space>
                    </template>
                </n-thing>
            </n-gi>
        </n-grid>
    </n-card>

    <n-divider />

    <n-thing>
        <template #avatar>
            <n-avatar>
                <n-icon>
                    <DollarSign />
                </n-icon>
            </n-avatar>
        </template>
        <template #header>
        货币
        </template>
        <template #header-extra>
            <n-button circle size="small">
                <template #icon>
                    <DollarSign />
                </template>
            </n-button>
        </template>
        <template #description>
        描述
        </template>
        货币是为了提高交易效率而用于交换的中介商品。货币有多种形式，如贝壳粮食等自然物、金属纸张等加工品、银行卡信用卡等磁条卡、移动支付加密货币等APP。
        <template #footer>
        尾部
        </template>
        <template #action>
            <n-space>
                <n-button size="small">
                <template #icon>
                    <n-icon>
                    <DollarSign />
                    </n-icon>
                </template>
                1 块钱
                </n-button>
                <n-button size="small">
                <template #icon>
                    <n-icon>
                    <DollarSign />
                    </n-icon>
                </template>
                10 块钱
                </n-button>
                <n-button size="small">
                <template #icon>
                    <n-icon>
                    <DollarSign />
                    </n-icon>
                </template>
                100 块钱
                </n-button>
            </n-space>
        </template>
    </n-thing>

    <n-divider />

</template>

<script setup>
    import { CanadianMapleLeaf,ThumbsUpRegular, ThumbsDownRegular,HeartRegular,DollarSign} from '@vicons/fa';
</script>

<style scoped>
.light-green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.24);
}
</style>