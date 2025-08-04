<template>
    <n-card>
        <n-thing>
            <template #avatar>
                <n-avatar>
                    <n-icon>
                        <Pen />
                    </n-icon>
                </n-avatar>
            </template>
            <template #header>
                <n-ellipsis line-clamp="1">
                    {{blog.title}}
                </n-ellipsis>
            </template>
            <template #description>
                <span class="text-gray-400"> {{blog.author}},{{blog.createDate}} </span>
            </template>
            <n-ellipsis line-clamp="2" :tooltip="false">
                <n-text depth="3">
                    {{ blog.content }}
                </n-text>
            </n-ellipsis>
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
        </n-thing>
    </n-card>
</template>

<script setup>
    import { Pen,ThumbsUpRegular, ThumbsDownRegular,HeartRegular,DollarSign} from '@vicons/fa';

    const props = defineProps(
        {
            blog:{type:Object,required:true},//博客对象
        }
    )
</script>