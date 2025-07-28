<template>
    <n-card>
        <n-thing>
            <template #avatar>
                <n-avatar>
                    <n-icon>
                        <DollarSign />
                    </n-icon>
                </n-avatar>
            </template>
            <template #header>
                <n-ellipsis line-clamp="1">
                    {{blog.title}}
                </n-ellipsis>
            </template>
            <template #header-extra>
                <n-button circle size="small">
                    <template #icon>
                        <DollarSign />
                    </template>
                </n-button>
            </template>
            <template #description>
                <span class="text-gray-400"> {{blog.author}},{{blog.createDate}}4 </span>
            </template>
            <n-ellipsis line-clamp="2" :tooltip="false">
                <n-text depth="3">
                    {{ blog.content }}
                </n-text>
            </n-ellipsis>
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
                    点赞
                    </n-button>
                    <n-button size="small">
                    <template #icon>
                        <n-icon>
                        <DollarSign />
                        </n-icon>
                    </template>
                    不喜欢
                    </n-button>
                    <n-button size="small">
                    <template #icon>
                        <n-icon>
                        <DollarSign />
                        </n-icon>
                    </template>
                    收藏
                    </n-button>
                </n-space>
            </template>
        </n-thing>
    </n-card>
</template>

<script setup>
    const props = defineProps(
        {
            blog:{type:Object,required:true},//博客对象
        }
    )
</script>