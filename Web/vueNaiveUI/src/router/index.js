import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TreeView1 from '@/views/TreeView1.vue'
import TreeView from '@/views/TreeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  debug: true,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/Test.vue'),
    },
    {
        path: '/tree',
        name: 'tree',
        component: TreeView,
    },
    {
        path: '/tree1',
        name: 'tree1',
        component: TreeView1,
    },
    {
        path: '/for',
        name: 'for',
        component: () => import('@/views/forView.vue'),
    },
    {
        path: '/cherryMarkdown',
        name: 'CherryMarkdownTest0',
        component: () => import('@/views/CherryMarkdownView.vue'),
    },
    {
        path: '/cherryMarkdown1',
        name: 'CherryMarkdownTest1',
        component: () => import('@/views/CherryMarkdownView1.vue'),
    },
    {
        path: '/editormd',
        name: 'editor-md-v3',
        component: () => import('@/views/EditorMd.vue'),
    },
    {
        path: '/ContainerView',
        name: 'ContainerView',
        component: () => import('@/views/ContainerView.vue'),
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/views/Admin.vue'),
        children:[
            {
                path:'about',
                props:true,
                component:()=>import("@/components/admin/About.vue"),
                meta:{title:'Admin/About'}
            },
            {
                path:'contact',
                props:true,
                component:()=>import("@/components/admin/Contact.vue"),
                meta:{title:'Admin/Contact'}
            },
        ]
    },
    {
        path: '/router',
        name: 'Router',
        component: () => import('@/views/Router.vue'),
        children:[
            {
                path:'routerview1',
                props:true,
                component:()=>import("@/components/router/RouterView1.vue"),
                meta:{title:'Router/RouterView1'}
            },
            {
                path:'routerview2',
                props:true,
                component:()=>import("@/components/router/RouterView2.vue"),
                meta:{title:'Router/RouterView2'}
            },
        ]
    },
    {
        path: '/Layout',
        name: 'LayoutView',
        component: () => import('@/views/LayoutView.vue'),
    },
    {
        path: '/CropperJs2',
        name: 'Cropper2',
        component: () => import('@/views/CropperJs2.vue'),
    },
    {
        path: '/Cropperjs1',
        name: 'Cropperjs2.0',
        component: () => import('@/views/CropperJs1.vue'),
    },
    {
        path: '/VueCropper',
        name: 'VueCropper',
        component: () => import('@/views/VueCropper.vue'),
    },
    {
        path: '/VueCropper1',
        name: 'VueCropper1',
        component: () => import('@/views/VueCropper1.vue'),
    },
    {
        path: '/ListView',
        name: 'ListView',
        component: () => import('@/views/ListView.vue'),
    },
    {
        path: '/Reuseable',
        name: '可重用子组件',
        component: () => import('@/views/ReuseableComponentView.vue'),
    },
    {
        path: '/Cards',
        name: '卡片组件',
        component: () => import('@/views/CardsView.vue'),
    },
    {
        path: '/Life',
        name: '组件生命周期',
        component: () => import('@/views/ComponentLife.vue'),
        children:[
            {
                path:'Comp1',
                props:true,
                component:()=>import("@/components/life/Comp1.vue"),
                meta:{title:'Life/Comp1'}
            },
            {
                path:'Comp2',
                props:true,
                component:()=>import("@/components/life/Comp2.vue"),
                meta:{title:'Life/Comp2'}
            },
        ]
    },
    {
        path: '/test',
        component: ()=>import("@/views/test/Index.vue"),
        children:[
            {
                path:'imgcontainer',
                props:true,
                component:()=>import("@/components/test/imgContainer.vue"),
                meta:{title:'img-container'}
            },
            {
                path:'expandMenu',
                props:true,
                component:()=>import("@/components/test/expandMenu.vue"),
                meta:{title:'expand menu'}
            },
            {
                path:'split',
                props:true,
                component:()=>import("@/components/test/split.vue"),
                meta:{title:'split'}
            },
        ]
    },
    {
        path: '/Scrollbar',
        name: '滚动条',
        component: () => import('@/views/ScrollBarView.vue'),
    },
    {
        path: '/Layout1',
        name: '布局组件-1',
        component: () => import('@/views/LayoutView1.vue'),
    },
    {
        path: '/Layout2',
        name: '布局组件-2',
        component: () => import('@/views/LayoutView2.vue'),
    },
    {
        path: '/threejs',  // 改为全小写
        component: () => import('@/views/ThreeJsView.vue'),
        children:[
            {
                path:'',
                component:()=>import("@/components/ThreeJs/RouterIndex.vue"),
                meta:{title:'Index'}
            },
            {
                path:'basic-example',  // 推荐使用 kebab-case
                component:()=>import("@/components/ThreeJs/BasicExample.vue"),
                meta:{title:'基础示例'}
            },
            {
                path: 'target-demo',
                name: 'TargetDemo',
                component: () => import('@/components/ThreeJs/TargetDemo.vue'),
            },
            {
                path: 'camera',
                name: 'camera',
                component: () => import('@/components/ThreeJs/Camera.vue'),
            },
            {
                path: 'lights',
                name: 'lights',
                component: () => import('@/components/ThreeJs/Lights.vue'),
            },
            {
                path: 'scene',
                name: 'scene',
                component: () => import('@/components/ThreeJs/Scene.vue'),
            },
            {
                path: 'demo',
                name: 'demo',
                component: () => import('@/components/ThreeJs/Demo.vue'),
            },
            {
                path: 'responsive',
                name: 'Responsive',
                component: () => import('@/components/ThreeJs/Responsive.vue'),
            },
            {
                path: 'helper',
                name: 'helper',
                component: () => import('@/components/ThreeJs/Helper.vue'),
            },
            {
                path: 'ray-update',
                name: 'ray-update',
                component: () => import('@/components/ThreeJs/RayUpdate.vue'),
            },
            {
                path: 'ray-update-1',
                name: 'ray-update-1',
                component: () => import('@/components/ThreeJs/RayUpdate1.vue'),
            },
            {
                path: 'trackball',
                name: 'Trackball',
                component: () => import('@/components/ThreeJs/TrackballUsage.vue'),
            },
            {
                path: 'rotation-translate',
                name: 'Rotate-Translate',
                component: () => import('@/components/ThreeJs/RotationTranslate.vue'),
            },
        ]
    },
    {
        path: '/file-process',
        name: '文件处理集成',
        component: () => import('@/views/FileProcessView.vue'),
    },
    {
        path: '/FileUpload',
        name: 'FileSelect',
        component: () => import('@/views/FileDragDropView.vue'),
    },
    {
        path: '/slider',
        name: 'Slider',
        component: () => import('@/views/SliderView.vue'),
    },
  ],
})

export default router
