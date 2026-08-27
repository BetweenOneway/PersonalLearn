<template>
  <div class="dirary-wrapper">
    <!-- 左侧：日历栏 -->
    <div class="dirary-left">
      <n-calendar
        v-model:value="selectedDate"
        #="{ year, month, date }"
        :is-date-disabled="isDateDisabled"
        @update:value="handleUpdateValue"
      >
        {{ year }}-{{ month }}-{{ date }}
      </n-calendar>
    </div>

    <!-- 右侧：提示 / 当日待办与日记 -->
    <div class="dirary-right">
      <!-- 未点选日期时的提示 -->
      <div v-if="!selectedDate" class="dirary-placeholder">
        <n-empty description="点击任意日期，添加日记或待办事项" />
      </div>

      <!-- 已点选日期：显示当日内容 -->
      <div v-else class="dirary-detail">
        <div class="dirary-detail-header">
          <span class="dirary-date">{{ formatDate(selectedDate) }}</span>
        </div>

        <n-collapse
          v-model:expanded-names="collapseActive"
          class="dirary-collapse"
        >
          <!-- 当日待办事项 -->
          <n-collapse-item title="待办事项" name="todo">
            <template #header-extra>
              <n-button size="small" tertiary type="primary" @click.stop="addTodo">
                <template #icon>
                  <n-icon :component="AddBoxRound" />
                </template>
                新增
              </n-button>
            </template>

            <n-scrollbar class="dirary-todo-scroll">
              <n-empty
                v-if="currentDay.todos.length === 0"
                size="small"
                description="暂无待办，点击新增"
              />
              <n-list v-else>
                <n-list-item v-for="todo in currentDay.todos" :key="todo.id">
                  <div class="dirary-todo-item">
                    <n-checkbox
                      v-if="!todo.editing"
                      :checked="todo.done"
                      @update:checked="val => toggleTodo(todo, val)"
                    >
                      <span :class="{ 'todo-done': todo.done }">{{ todo.text }}</span>
                    </n-checkbox>
                    <n-input
                      v-else
                      v-model:value="todo.text"
                      size="small"
                      class="dirary-todo-edit"
                      :ref="el => setTodoInputRef(el, todo.id)"
                      @keyup.enter="confirmEditTodo(todo)"
                    />

                    <div class="dirary-todo-actions">
                      <template v-if="!todo.editing">
                        <n-button text size="tiny" type="primary" @click="startEditTodo(todo)">
                          编辑
                        </n-button>
                        <n-button text size="tiny" type="error" @click="removeTodo(todo)">
                          删除
                        </n-button>
                      </template>
                      <template v-else>
                        <n-button text size="tiny" type="primary" @click="confirmEditTodo(todo)">
                          确定
                        </n-button>
                        <n-button text size="tiny" @click="cancelEditTodo(todo)">
                          取消
                        </n-button>
                      </template>
                    </div>
                  </div>
                </n-list-item>
              </n-list>
            </n-scrollbar>
          </n-collapse-item>

          <!-- 当日日记 -->
          <n-collapse-item title="日记" name="diary">
            <n-input
              v-model:value="currentDay.diary"
              type="textarea"
              placeholder="记录这一天的故事……"
              :autosize="{ minRows: 4, maxRows: 12 }"
              class="dirary-diary-input"
            />
            <div class="dirary-diary-actions">
              <n-button size="small" type="primary" @click="saveDiary">
                保存
              </n-button>
              <n-button size="small" @click="deleteDiary">
                删除
              </n-button>
            </div>
          </n-collapse-item>
        </n-collapse>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from "vue";
import { useMessage, NIcon } from "naive-ui";
import { addDays, isYesterday, format } from "date-fns";
import { AddBoxRound } from "@vicons/material";
import noteApi from '@/request/api/noteApi';
import noteServerRequest from '@/request';

const message = useMessage();

// 已选日期（毫秒时间戳），null 表示未点选
const selectedDate = ref(null);

// 折叠面板默认展开项（待办 + 日记）
const collapseActive = ref(["todo", "diary"]);

// 各日期的待办与日记数据：来自后端服务器
// 结构：{ [dateKey]: { todos: [{id,text,done}], diary: string } }
const dayMap = reactive({});

// 数据加载状态
const loading = ref(false);
// 已向后端请求过的日期集合（避免重复请求）
const dayLoaded = new Set();

// 向后端加载指定日期的待办与日记（接口已定义，后端暂未实现）
async function loadDiary(key) {
  if (dayLoaded.has(key)) return; // 已请求则不再请求
  dayLoaded.add(key);
  dayMap[key] = { todos: [], diary: "" }; // 先占位，保证响应式可用
  loading.value = true;
  try {
    const API = { ...noteApi.getDiary };
    API.params = { date: key };
    const res = await noteServerRequest(API);
    // 后端返回结构约定：{ todos: [...], diary: "..." }
    dayMap[key] = res && res.data
      ? { todos: res.data.todos || [], diary: res.data.diary || "" }
      : { todos: [], diary: "" };
  } catch (e) {
    dayMap[key] = { todos: [], diary: "" };
  } finally {
    loading.value = false;
  }
}

// 向后端保存指定日期的待办与日记（接口已定义，后端暂未实现）
async function persistDiary(dateKey) {
  const data = dayMap[dateKey] || { todos: [], diary: "" };
  const API = { ...noteApi.saveDiary };
  API.data = { date: dateKey, todos: data.todos, diary: data.diary };
  await noteServerRequest(API);
}

// 向后端删除指定日期的日记（接口已定义，后端暂未实现）
async function persistDeleteDiary(dateKey) {
  const API = { ...noteApi.deleteDiary };
  API.params = { date: dateKey };
  await noteServerRequest(API);
}

function dateKey(ts) {
  return format(ts, "yyyy-MM-dd");
}

// 当前选中日期对应的数据（确保返回可读对象，但不预先写入 dayMap，
// 以免 loadDiary 误判为已加载）
const currentDay = computed(() => {
  if (!selectedDate.value) return { todos: [], diary: "" };
  const key = dateKey(selectedDate.value);
  return dayMap[key] || { todos: [], diary: "" };
});

function formatDate(ts) {
  return format(ts, "yyyy 年 MM 月 dd 日");
}

function handleUpdateValue(ts, { year, month, date }) {
  selectedDate.value = ts;
  loadDiary(dateKey(ts));
}

function isDateDisabled(timestamp) {
  return false;
}

// 待办自增 id
let todoIdSeq = 1;

// 收集编辑态输入框实例：{ [todoId]: inputComponent }
const todoInputRefs = {};

function setTodoInputRef(el, id) {
  if (el) {
    todoInputRefs[id] = el;
  } else {
    delete todoInputRefs[id];
  }
}

// 进入编辑模式后将焦点放到输入框
function focusTodoInput(id) {
  nextTick(() => {
    const input = todoInputRefs[id];
    if (input && typeof input.focus === "function") {
      input.focus();
    }
  });
}

// 待办发生确认性变更后，自动保存到后端
async function persistCurrent() {
  if (!selectedDate.value) return;
  const key = dateKey(selectedDate.value);
  try {
    await persistDiary(key);
  } catch (e) {
    message.error("待办保存失败，请稍后重试");
  }
}

function addTodo() {
  const id = todoIdSeq++;
  currentDay.value.todos.push({
    id,
    text: "",
    done: false,
    editing: true,
  });
  focusTodoInput(id);
}

function toggleTodo(todo, val) {
  todo.done = val;
  persistCurrent();
}

function startEditTodo(todo) {
  todo._backup = todo.text;
  todo.editing = true;
  focusTodoInput(todo.id);
}

function confirmEditTodo(todo) {
  const text = (todo.text || "").trim();
  if (!text) {
    message.warning("待办内容不能为空");
    return;
  }
  todo.text = text;
  todo.editing = false;
  persistCurrent();
}

function cancelEditTodo(todo) {
  // 新增项（无备份文本）取消时直接移除，避免留下空待办
  if (todo._backup === undefined) {
    removeTodo(todo);
    return;
  }
  todo.text = todo._backup;
  todo.editing = false;
}

function removeTodo(todo) {
  const list = currentDay.value.todos;
  const idx = list.findIndex(t => t.id === todo.id);
  if (idx !== -1) list.splice(idx, 1);
  persistCurrent();
}

// 日记保存 / 删除
async function saveDiary() {
  if (!selectedDate.value) return;
  const key = dateKey(selectedDate.value);
  try {
    await persistDiary(key);
    message.success("日记已保存");
  } catch (e) {
    message.error("保存失败，请稍后重试");
  }
}

async function deleteDiary() {
  if (!selectedDate.value) return;
  const key = dateKey(selectedDate.value);
  try {
    await persistDeleteDiary(key);
    dayMap[key] = { todos: dayMap[key]?.todos || [], diary: "" };
    message.success("日记已删除");
  } catch (e) {
    message.error("删除失败，请稍后重试");
  }
}
</script>

<style scoped>
.diary-wrapper,
.dirary-wrapper {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

/* 左侧日历栏 */
.dirary-left {
  flex: 6 1 0;
  min-width: 560px;
  max-width: 760px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dirary-left :deep(.n-calendar) {
  flex: 1;
  min-height: 0;
  height: 100%;
}

.dirary-left :deep(.n-calendar-body) {
  flex: 1;
  min-height: 0;
}

/* 防止日历单元格日期文字折行 */
.dirary-left :deep(.n-calendar-cell) {
  white-space: nowrap;
}

/* 右侧栏 */
.dirary-right {
  flex: 5 1 0;
  min-width: 320px;
  height: 100%;
  background: var(--n-color-modal, #fff);
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 未点选提示 */
.dirary-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 已点选详情 */
.dirary-detail {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
}

.dirary-detail-header {
  flex-shrink: 0;
}

.dirary-date {
  font-size: 18px;
  font-weight: 600;
}

.dirary-collapse {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dirary-collapse :deep(.n-collapse-item) {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.dirary-collapse :deep(.n-collapse-item__content-wrapper) {
  flex: 1;
  min-height: 0;
}

.dirary-collapse :deep(.n-collapse-item__content-inner) {
  height: 100%;
}

.dirary-todo-scroll {
  flex: 1;
  min-height: 0;
  max-height: 240px;
}

.dirary-todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.dirary-todo-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dirary-todo-edit {
  flex: 1;
  min-width: 0;
  margin-right: 8px;
}

.todo-done {
  text-decoration: line-through;
  color: #999;
}

.dirary-diary-input {
  width: 100%;
}

.dirary-diary-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

/* 滚动条整体不溢出页面 */
.dirary-right :deep(.n-scrollbar-container) {
  height: 100%;
}
</style>
