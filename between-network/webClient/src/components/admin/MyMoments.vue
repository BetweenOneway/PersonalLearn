<template>
    <n-layout content-style="padding:25px">
        <h3 style="margin:0 0 16px">我的说说</h3>

        <n-data-table
            :bordered="false"
            :single-line="false"
            single-column
            :columns="columns"
            :data="momentList"
            :row-key="rowKey"
            :loading="loading"
            :pagination="pagination"
            style="margin-top:16px"
        />
    </n-layout>
</template>

<script setup>
    import { ref, h, reactive, onMounted } from 'vue';
    import { NTag, NButton, NSpace } from 'naive-ui';
    import { storeToRefs } from 'pinia';
    import noteServerRequest from "@/request";
    import { momentApi } from "@/request/api/interactionApi";
    import { useUserStore } from "@/stores/userStore";

    const userStore = useUserStore();
    const { id: currentUserId } = storeToRefs(userStore);

    const momentList = ref([]);
    const loading = ref(false);
    const rowKey = (row) => row.id;

    const pagination = reactive({
        page: 1,
        pageSize: 10,
        itemCount: 0,
        showSizePicker: true,
        pageSizes: [10, 20, 50],
        onChange: (page) => {
            pagination.page = page;
            loadMoments();
        },
        onUpdatePageSize: (size) => {
            pagination.pageSize = size;
            pagination.page = 1;
            loadMoments();
        }
    });

    function formatTime(t) {
        if (!t) return '';
        const d = new Date(t);
        if (isNaN(d.getTime())) return t;
        const pad = (n) => (n < 10 ? '0' + n : '' + n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    function statusTag(row) {
        // moment 状态：0 被删除，1 正常/私有，2 公开
        if (row.status === 2) {
            return h(NTag, { type: 'success', size: 'small' }, { default: () => '公开' });
        }
        if (row.status === 1) {
            return h(NTag, { type: 'default', size: 'small' }, { default: () => '私有' });
        }
        return h(NTag, { type: 'error', size: 'small' }, { default: () => '已删除' });
    }

    // 删除单条说说（软删除）
    function handleDelete(row) {
        window.$dialog.warning({
            title: '删除确认',
            content: '确定删除这条说说吗？该操作不可恢复。',
            positiveText: '删除',
            negativeText: '取消',
            onPositiveClick: async () => {
                let API = { ...momentApi.deleteMoment };
                API.data = { momentId: row.id };
                const res = await noteServerRequest(API);
                if (res) {
                    momentList.value = momentList.value.filter(item => item.id !== row.id);
                    pagination.itemCount = Math.max(0, pagination.itemCount - 1);
                }
            }
        });
    }

    // 切换说说可见性：targetStatus 1=私有（仅自己可见），2=公开
    async function handleUpdateStatus(row, targetStatus) {
        let API = { ...momentApi.updateMomentStatus };
        API.data = { momentId: row.id, targetStatus };
        const res = await noteServerRequest(API);
        if (res) {
            row.status = targetStatus;
        }
    }

    const columns = [
        {
            title: '内容',
            key: 'content',
            minWidth: 280,
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
            title: '发布时间',
            key: 'time',
            width: 180,
            render: (row) => formatTime(row.time)
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            fixed: 'right',
            render: (row) => {
                const buttons = [
                    h(NButton, {
                        size: 'small',
                        type: 'warning',
                        tertiary: true,
                        onClick: () => handleDelete(row)
                    }, { default: () => '删除' })
                ];
                // 私有(1)：可设为公开；公开(2)：可设为仅自己可见
                if (row.status === 1) {
                    buttons.push(h(NButton, {
                        size: 'small',
                        type: 'success',
                        tertiary: true,
                        onClick: () => handleUpdateStatus(row, 2)
                    }, { default: () => '公开' }));
                } else if (row.status === 2) {
                    buttons.push(h(NButton, {
                        size: 'small',
                        type: 'default',
                        tertiary: true,
                        onClick: () => handleUpdateStatus(row, 1)
                    }, { default: () => '仅自己可见' }));
                }
                return h(NSpace, { size: 'small' }, { default: () => buttons });
            }
        }
    ];

    async function loadMoments() {
        if (!currentUserId.value) return;
        loading.value = true;
        try {
            let API = { ...momentApi.getMomentList };
            API.params = {
                uId: currentUserId.value,
                pageIndex: pagination.page - 1,
                pageSize: pagination.pageSize
            };
            const res = await noteServerRequest(API);
            if (res && res.data) {
                momentList.value = res.data;
                pagination.itemCount = res.total || res.data.length;

                console.log("get Moment list=>",momentList.value)
            }
        } catch (e) {
            console.log(e);
        } finally {
            loading.value = false;
        }
    }

    onMounted(() => {
        loadMoments();
    });
</script>

<style scoped>
</style>
