<template>
    <n-layout content-style="padding:25px">
        <!--标题 操作按钮-->
        <n-space justify="space-between" align="center" style="margin-bottom:20px">
            <h3 style="margin:0">回收站</h3>
            <n-space>
                <n-button ghost type="success" @click="batchRestore">批量恢复</n-button>
                <n-button ghost type="error" @click="clickBatchDeleteBtn">批量彻底删除</n-button>
            </n-space>
        </n-space>
        <!--表格（删除的笔记/文件夹 + 删除的说说）-->
        <n-data-table
            flex-height
            striped
            :columns="columns"
            :data="data"
            :pagination="pagination"
            v-model:checked-row-keys="rowChecked"
            @update:page="rowChecked=[]"
            style="height:calc(100vh - 160px)"
        />
    </n-layout>
    <!--删除提醒框（用于笔记/文件夹彻底删除）-->
    <DeleteRemindDialog @delete="refreshAll" @remove="removeRowChecked"></DeleteRemindDialog>
</template>

<script setup>
    import { ref, computed, h } from 'vue';
    import { NTag, NSpace, NButton, NText, useMessage } from 'naive-ui'
    import noteServerRequest  from "@/request"
    import dumpsterApi from '@/request/api/dumpsterApi';
    import { momentApi } from '@/request/api/interactionApi';

    import DeleteRemindDialog from "@/components/remind/DeleteRemindDialog.vue";
    import { useDeleteRemindDialogStore } from "@/stores/deleteRemindDialogStore";

    const deleteRemindDialogStore = useDeleteRemindDialogStore();
    const { showFromDumpsterSingle, showFromDumpsterMulti } = deleteRemindDialogStore;

    const message = useMessage();

    // 时间格式化
    function formatTime(t) {
        if (!t) return '';
        const d = new Date(t);
        if (isNaN(d.getTime())) return t;
        const pad = (n) => (n < 10 ? '0' + n : '' + n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    /* ============ 数据源：笔记/文件夹(文件) + 说说，合并为一张表 ============ */
    const noteList = ref([]);   // kind:'note'
    const momentList = ref([]); // kind:'moment'

    // 合并后的表格数据
    const data = computed(() => [...noteList.value, ...momentList.value]);

    //分页配置
    const pagination = ref({
        pageSizes: [10, 20, 50],
        showSizePicker: true,
        size: 'large'
    });

    //选中了哪些行
    const rowChecked = ref([]);

    // 获取已删除的笔记/文件夹（后端返回 title / updateTime）
    function getFileList() {
        noteServerRequest(dumpsterApi.getFileList).then(responseData => {
            if (!responseData) return;
            const files = responseData.data || [];
            files.forEach(item => {
                item.kind = 'note';
                item.key = item.id + ':' + item.type;
            });
            noteList.value = files;
            clearRowChecked();
        });
    }

    // 获取已删除的说说
    function getDeletedMoments() {
        noteServerRequest(momentApi.getDeletedMomentList).then(responseData => {
            if (!responseData) return;
            const list = responseData.data || [];
            list.forEach(item => {
                item.kind = 'moment';
                item.key = 'moment:' + item.id;
                item.name = item.content; // 复用"名称"列渲染
            });
            momentList.value = list;
            clearRowChecked();
        });
    }

    // 同时刷新两类数据
    function refreshAll() {
        getFileList();
        getDeletedMoments();
    }

    refreshAll();

    // 表格中的列
    const columns = [
        { type: "selection" },
        {
            title: "名称",
            key: "title",
            render: row => {
                // 文件用 title，说说用 content(已映射到 name)
                let title = row.kind === 'moment' ? row.name : row.title;
                let depth = 1;
                if (!title) {
                    title = row.kind === 'moment' ? '（空内容）' : '未设置文件名称';
                    depth = 3;
                }
                return h(NText, { depth }, { default: () => title });
            }
        },
        {
            title: "类型",
            key: "type",
            render: row => {
                if (row.kind === 'moment') {
                    return h(NTag, { size: 'small', bordered: false, type: 'warning' }, { default: () => '说说' });
                }
                let color = 'success';
                let label = '文件';
                switch (row.type) {
                    case 1:
                        color = 'success';
                        label = '文件';
                        break;
                    case 2:
                        color = 'info';
                        label = '文件夹';
                        break;
                }
                return h(NTag, { size: 'small', bordered: false, type: color }, { default: () => label });
            }
        },
        {
            title: "时间",
            key: "time",
            render: row => formatTime(row.kind === 'moment' ? row.time : row.updateTime)
        },
        {
            title: "操作",
            key: "action",
            render: row => h(
                NSpace, null,
                {
                    default: () => [
                        h(NButton,
                            {
                                size: 'small', type: 'success', tertiary: true,
                                onClick: () => restoreRow(row)
                            },
                            { default: () => "恢复" }
                        ),
                        h(NButton,
                            {
                                size: 'small', type: 'error', tertiary: true,
                                onClick: () => deleteRow(row)
                            },
                            { default: () => "彻底删除" }
                        )
                    ]
                }
            )
        }
    ];

    /* ============ 操作分发 ============ */
    const checkedRowsObjects = computed(() =>
        data.value.filter(item => rowChecked.value.indexOf(item.key) !== -1)
    );

    // 恢复：按类型分发
    function restoreRow(row) {
        if (row.kind === 'moment') {
            let API = { ...momentApi.restoreMoment };
            API.data = { momentId: row.id };
            noteServerRequest(API).then(rd => { if (rd) refreshAll(); });
        } else {
            let API = { ...dumpsterApi.restoreFiles };
            API.name = API.name[0];
            API.data = { files: [row] };
            noteServerRequest(API).then(rd => { if (rd) refreshAll(); });
        }
    }

    // 彻底删除：笔记走删除确认框，说说走二次确认
    function deleteRow(row) {
        if (row.kind === 'moment') {
            window.$dialog.warning({
                title: '彻底删除',
                content: '彻底删除后无法恢复，确定删除这条说说吗？',
                positiveText: '删除',
                negativeText: '取消',
                onPositiveClick: () => {
                    let API = { ...momentApi.deleteMomentPermanent };
                    API.data = { momentId: row.id };
                    noteServerRequest(API).then(rd => { if (rd) refreshAll(); });
                }
            });
        } else {
            showFromDumpsterSingle(row);
        }
    }

    // 批量恢复：拆分两类分别处理
    function batchRestore() {
        const rows = checkedRowsObjects.value;
        if (rows.length === 0) {
            message.warning('未选择任何内容');
            return;
        }
        const noteRows = rows.filter(r => r.kind === 'note');
        const momentRows = rows.filter(r => r.kind === 'moment');

        if (noteRows.length) {
            let API = { ...dumpsterApi.restoreFiles };
            API.name = noteRows.length === 1 ? API.name[0] : API.name[1];
            API.data = { files: noteRows };
            noteServerRequest(API);
        }
        if (momentRows.length) {
            Promise.all(momentRows.map(r =>
                noteServerRequest({ ...momentApi.restoreMoment, data: { momentId: r.id } })
            ));
        }
        // 操作结束后统一刷新
        setTimeout(refreshAll, 300);
    }

    // 批量彻底删除：拆分两类分别处理
    function clickBatchDeleteBtn() {
        const rows = checkedRowsObjects.value;
        if (rows.length === 0) {
            message.warning('未选择任何内容');
            return;
        }
        const noteRows = rows.filter(r => r.kind === 'note');
        const momentRows = rows.filter(r => r.kind === 'moment');

        if (noteRows.length) {
            showFromDumpsterMulti(noteRows); // 其确认框删除成功后 @delete 触发 refreshAll
        }
        if (momentRows.length) {
            window.$dialog.warning({
                title: '批量彻底删除',
                content: `确定彻底删除选中的 ${momentRows.length} 条说说吗？此操作不可恢复。`,
                positiveText: '删除',
                negativeText: '取消',
                onPositiveClick: () => {
                    Promise.all(momentRows.map(r =>
                        noteServerRequest({ ...momentApi.deleteMomentPermanent, data: { momentId: r.id } })
                    )).then(() => refreshAll());
                }
            });
        }
    }

    // 清除无效勾选
    function clearRowChecked() {
        const validKeys = data.value.map(item => item.key);
        rowChecked.value = rowChecked.value.filter(k => validKeys.indexOf(k) !== -1);
    }

    // 指定行取消勾选
    const removeRowChecked = (key) => {
        rowChecked.value = rowChecked.value.filter(item => item !== key);
    }
</script>
