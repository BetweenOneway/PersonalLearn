<template>
    <div>
        <n-layout has-sider>
            <div>
                <n-flex vertical>
                    <n-button type="primary" text size="large" style="margin-top: 20px;">
                        <template #icon>
                            <n-icon>
                                <AddBoxRound />
                            </n-icon>
                        </template>
                        新建笔记
                    </n-button>
                    <n-divider style="margin:15px auto"></n-divider>
                    <n-layout-sider
                    bordered
                    show-trigger
                    collapse-mode="width"
                    :collapsed-width="64"
                    :width="240"
                    :native-scrollbar="false"
                    >
                    <n-menu
                        :collapsed-width="64"
                        :collapsed-icon-size="22"
                        :options="menuOptions"
                    />
                    </n-layout-sider>
                </n-flex>
            </div>
            <n-layout has-sider>
                <n-layout-sider bordered>
                    海淀桥
                </n-layout-sider>
                <n-layout-content>
                    平山道
                </n-layout-content>
            </n-layout>
        </n-layout>
    </div>
</template>
  
<script setup>
  import {
    MenuBookOutlined as BookIcon,
    AddBoxRound
  } from "@vicons/material";
  import { NIcon } from "naive-ui";
  import { h } from "vue";
  
  function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
  }
  
  const menuOptions = [
    {
        label: "我的文件夹",
        key: "my-folder",
        icon: renderIcon(BookIcon),
        children: [
            {
                label: "人物",
                key: "people",
                children: [
                {
                    label: "叙事者",
                    key: "narrator",
                    icon: renderIcon(BookIcon)
                },
                {
                    label: "羊男",
                    key: "sheep-man",
                    icon: renderIcon(BookIcon)
                }
            ]
            },
            {
                label: "饮品",
                key: "beverage",
                icon: renderIcon(BookIcon),
                children: [
                    {
                        label: "威士忌",
                        key: "whisky"
                    }
                ]
            },
            {
                label: "食物",
                key: "food",
                children: [
                    {
                        label: "三明治",
                        key: "sandwich"
                    }
                ]
            },
            {
                label: "过去增多，未来减少",
                key: "the-past-increases-the-future-recedes"
            }
        ]
    },
    {
        label: "回收站",
        key: "recycle-bin",
        icon: renderIcon(BookIcon)
    }
  ];
</script>