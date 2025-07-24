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
                <n-card title="笔记标题3" hoverable>
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
                <n-card title="笔记标题5" hoverable>
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
                <n-card title="笔记标题6" hoverable>
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
                <n-card title="笔记标题7" hoverable>
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
                <n-card title="笔记标题8" hoverable>
                    内容
                    <template #footer>
                    #footer
                    </template>
                    <template #action>
                    #action
                    </template>
                </n-card>
            </n-gi>
        </n-grid>
    </n-card>
</template>

<script setup>
    import { CanadianMapleLeaf,ThumbsUpRegular, ThumbsDownRegular,HeartRegular} from '@vicons/fa';
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