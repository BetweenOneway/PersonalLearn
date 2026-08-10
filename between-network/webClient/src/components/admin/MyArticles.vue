<template>
    <n-layout content-style="padding:25px">
        <h3 style="margin:0 0 16px">我的文章</h3>

        <n-data-table
            :bordered="false"
            :single-line="false"
            single-column
            :columns="columns"
            :data="articleList"
            :row-key="rowKey"
            :loading="loading"
            :pagination="pagination"
            style="margin-top:16px"
        />
    </n-layout>
</template>

<script setup>
    import { ref, h, onMounted } from 'vue';
    import { NTag, NButton, NSpace } from 'naive-ui';
    import noteServerRequest from "@/request";
    import noteApi from "@/request/api/noteApi";
    import { toHerf } from "@/router/go";

    const articleList = ref([]);
    const loading = ref(false);
    const rowKey = (row) => row.id;

    const pagination = {
        pageSize: 10
    };

    function formatTime(t) {
        if (!t) return '';
        const d = new Date(t);
        if (isNaN(d.getTime())) return t;
        const pad = (n) => (n < 10 ? '0' + n : '' + n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    function statusTag(row) {
        if (row.status === 2) {
            return h(NTag, { type: 'success', size: 'small' }, { default: () => '已公开' });
        }
        return h(NTag, { type: 'default', size: 'small' }, { default: () => '未公开' });
    }

    // 编辑：跳转到笔记编辑页
    function handleEdit(row) {
        toHerf(`/note/edit/${row.id}`);
    }

    // 公开 / 取消公开
    async function handleTogglePublic(row) {
        const target = row.status === 2 ? 1 : 2;
        try {
            let API = { ...noteApi.publicNote };
            API.params = { noteId: row.id, targetOpenStatus: target };
            const res = await noteServerRequest(API);
            if (res) {
                row.status = target;
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 删除单篇
    function handleDelete(row) {
        window.$dialog.warning({
            title: '删除确认',
            content: `确定删除文章《${row.title}》吗？该操作不可恢复。`,
            positiveText: '删除',
            negativeText: '取消',
            onPositiveClick: async () => {
                let API = { ...noteApi.deleteNote };
                API.data = { id: row.id };
                const res = await noteServerRequest(API);
                if (res) {
                    articleList.value = articleList.value.filter(item => item.id !== row.id);
                }
            }
        });
    }

    const columns = [
        {
            title: '文章标题',
            key: 'title',
            minWidth: 200,
            ellipsis: {
                tooltip: true
            }
        },
        {
            title: '状态',
            key: 'status',
            width: 100,
            render: (row) => statusTag(row)
        },
        {
            title: '置顶',
            key: 'top',
            width: 80,
            render: (row) => row.top === 1 ? '是' : '否'
        },
        {
            title: '更新时间',
            key: 'update_time',
            width: 180,
            render: (row) => formatTime(row.update_time)
        },
        {
            title: '操作',
            key: 'actions',
            width: 240,
            fixed: 'right',
            render: (row) => {
                return h(NSpace, { size: 'small' }, {
                    default: () => [
                        h(NButton, {
                            size: 'small',
                            type: 'primary',
                            tertiary: true,
                            onClick: () => handleEdit(row)
                        }, { default: () => '编辑' }),
                        h(NButton, {
                            size: 'small',
                            type: 'warning',
                            tertiary: true,
                            onClick: () => handleDelete(row)
                        }, { default: () => '删除' }),
                        h(NButton, {
                            size: 'small',
                            type: row.status === 2 ? 'default' : 'success',
                            tertiary: true,
                            onClick: () => handleTogglePublic(row)
                        }, { default: () => row.status === 2 ? '取消公开' : '公开' })
                    ]
                });
            }
        }
    ];

    async function loadArticles() {
        loading.value = true;
        try {
            let API = { ...noteApi.getUserAllNoteList };
            const res = await noteServerRequest(API);
            if (res && res.data) {
                articleList.value = res.data;
            }
        } catch (e) {
            console.log(e);
        } finally {
            loading.value = false;
        }
    }

    onMounted(() => {
        loadArticles();
    });
</script>

<style scoped>
</style>
