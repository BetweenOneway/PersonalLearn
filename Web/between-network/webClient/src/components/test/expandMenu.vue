<template>
    <n-space vertical>
      <n-switch v-model:value="collapsed" />
      <n-layout has-sider>
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :render-label="renderMenuLabel"
            :render-icon="renderMenuIcon"
            :expand-icon="expandIcon"
          />
        </n-layout-sider>
        <n-layout>
          <span>内容<br/></span>
          <span>内容<br/></span>
          <span>内容<br/></span>
          <span>内容<br/></span>
          <span>内容<br/></span>
          <span>内容<br/></span>
        </n-layout>
      </n-layout>
    </n-space>
  </template>
  
  <script setup>
  import { BookmarkOutline, CaretDownOutline } from "@vicons/ionicons5";
  import { NIcon } from "naive-ui";
  import { defineComponent, h, ref } from "vue";
  
  const menuOptions = [
    {
      label: "且听风吟",
      key: "hear-the-wind-sing",
      href: "https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F/3199"
    },
    {
      label: "1973年的弹珠玩具",
      key: "pinball-1973",
      disabled: true,
      children: [
        {
          label: "鼠",
          key: "rat"
        }
      ]
    },
    {
      label: "寻羊冒险记",
      key: "a-wild-sheep-chase",
      disabled: true
    },
    {
      label: "舞，舞，舞",
      key: "dance-dance-dance",
      children: [
        {
          type: "group",
          label: "人物",
          key: "people",
          children: [
            {
              label: "叙事者",
              key: "narrator"
            },
            {
              label: "羊男",
              key: "sheep-man"
            }
          ]
        },
        {
          label: "饮品",
          key: "beverage",
          children: [
            {
              label: "威士忌",
              key: "whisky",
              href: "https://baike.baidu.com/item/%E5%A8%81%E5%A3%AB%E5%BF%8C%E9%85%92/2959816?fromtitle=%E5%A8%81%E5%A3%AB%E5%BF%8C&fromid=573&fr=aladdin"
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
    }
  ];
  
  let collapsed = ref(true);
  function renderMenuLabel(option) {
        if ("href" in option) {
        return h(
            "a",
            { href: option.href, target: "_blank" },
            option.label
        );
        }
        return option.label;
    }
    function renderMenuIcon(option) {
        if (option.key === "sheep-man")
        return true;
        if (option.key === "food")
        return null;
        return h(NIcon, null, { default: () => h(BookmarkOutline) });
    }
    function expandIcon() {
          return h(NIcon, null, { default: () => h(CaretDownOutline) });
    }
  </script>