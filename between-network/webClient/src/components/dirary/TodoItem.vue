<template>
  <div class="todo-item-wrap" :style="{ paddingLeft: depth * 14 + 'px' }">
    <div class="dirary-todo-item" :class="{ 'is-editing': todo.editing }">
      <!-- 展开/折叠子项 -->
      <n-button
        v-if="todo.children && todo.children.length"
        text
        size="tiny"
        class="todo-toggle"
        @click="todo._expanded = !todo._expanded"
      >
        <n-icon
          :component="todo._expanded ? KeyboardArrowDownRound : KeyboardArrowRightRound"
        />
      </n-button>
      <span v-else class="todo-toggle-placeholder" />

      <!-- 内容区（文本/输入框）占满剩余空间并左对齐 -->
      <div class="dirary-todo-content">
        <n-checkbox
          v-if="!todo.editing"
          :checked="todo.done"
          @update:checked="val => onToggle(val)"
        >
          <span :class="{ 'todo-done': todo.done }">{{ todo.text }}</span>
        </n-checkbox>
        <n-input
          v-else
          v-model:value="todo.text"
          size="small"
          class="dirary-todo-edit"
          :ref="el => setInputRef(el)"
          @keyup.enter="onConfirm"
        />
      </div>

      <div class="dirary-todo-actions">
        <template v-if="!todo.editing">
          <n-button text size="tiny" type="primary" @click="onStartEdit">编辑</n-button>
          <n-button text size="tiny" @click="onAddChild">子项</n-button>
          <n-button text size="tiny" type="error" @click="$emit('remove', todo)">删除</n-button>
        </template>
        <template v-else>
          <n-button text size="tiny" type="primary" @click="onConfirm">确定</n-button>
          <n-button text size="tiny" @click="$emit('cancel', todo)">取消</n-button>
        </template>
      </div>
    </div>

    <!-- 递归渲染子项 -->
    <div v-if="todo.children && todo.children.length && todo._expanded" class="todo-children">
      <TodoItem
        v-for="child in todo.children"
        :key="child.id"
        :todo="child"
        :depth="depth + 1"
        @change="onChildChange"
        @remove="onRemoveChild"
        @cancel="onCancelChild"
      />
    </div>
  </div>
</template>

<script setup>
import { nextTick, watch, inject } from "vue";
import { NIcon } from "naive-ui";
import { KeyboardArrowDownRound, KeyboardArrowRightRound } from "@vicons/material";

// 允许在模板中递归引用自身
defineOptions({ name: "TodoItem" });

const props = defineProps({
  todo: { type: Object, required: true },
  depth: { type: Number, default: 0 },
});

const emit = defineEmits(["change", "remove", "cancel"]);

// 待办 id 由父级（Dirary）通过 provide 统一生成，避免层级间冲突
const nextTodoId = inject("nextTodoId", () => Date.now() + Math.random());

const inputRefs = {};

// 进入编辑态时自动聚焦输入框（新增子项 / 点击编辑均生效）
watch(
  () => props.todo.editing,
  val => {
    if (val) focusInput();
  }
);
function setInputRef(el) {
  if (el) inputRefs.local = el;
  else delete inputRefs.local;
}

function focusInput() {
  nextTick(() => {
    const input = inputRefs.local;
    if (input && typeof input.focus === "function") input.focus();
  });
}

function onToggle(val) {
  props.todo.done = val;
  // 级联同步所有子级
  syncChildrenDone(props.todo, val);
  emit("change");
}

// 递归设置子级完成状态
function syncChildrenDone(todo, val) {
  if (!todo.children || !todo.children.length) return;
  for (const child of todo.children) {
    child.done = val;
    syncChildrenDone(child, val);
  }
}

// 子级状态变化后，根据本层所有子级重算自身完成状态：
// 任一子级未完成 -> 父级取消；全部完成 -> 父级自动完成
function onChildChange() {
  recalcDone(props.todo);
  emit("change");
}

function recalcDone(todo) {
  if (!todo.children || !todo.children.length) return;
  todo.done = todo.children.every(c => c.done);
}

function onStartEdit() {
  props.todo._backup = props.todo.text;
  props.todo.editing = true;
  focusInput();
}

function onConfirm() {
  const text = (props.todo.text || "").trim();
  if (!text) {
    emit("cancel", props.todo);
    return;
  }
  props.todo.text = text;
  props.todo.editing = false;
  emit("change");
}

function onAddChild() {
  if (!props.todo.children) props.todo.children = [];
  const id = nextTodoId();
  const child = { id, text: "", done: false, editing: true, children: [], _expanded: true };
  props.todo.children.push(child);
}

function onRemoveChild(child) {
  const list = props.todo.children;
  const idx = list.findIndex(t => t.id === child.id);
  if (idx !== -1) list.splice(idx, 1);
  emit("change");
}

function onCancelChild(child) {
  // 子项取消：若为新增空项则移除
  if (child._backup === undefined) {
    onRemoveChild(child);
    return;
  }
  child.text = child._backup;
  child.editing = false;
  emit("change");
}
</script>

<style scoped>
.todo-item-wrap {
  width: 100%;
  box-sizing: border-box;
}

.dirary-todo-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  gap: 4px;
}

.dirary-todo-content {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  text-align: left;
}

.todo-toggle {
  flex-shrink: 0;
  width: 22px;
  display: flex;
  justify-content: center;
}

.todo-toggle-placeholder {
  display: inline-block;
  width: 22px;
  flex-shrink: 0;
}

.dirary-todo-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dirary-todo-edit {
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  margin-right: 8px;
}

/* 关键：穿透到 n-input 内部，允许输入框收缩，避免撑破布局导致按钮溢出 */
.dirary-todo-edit :deep(.n-input-wrapper),
.dirary-todo-edit :deep(input) {
  min-width: 0;
}

.todo-done {
  text-decoration: line-through;
  color: #999;
}

.todo-children {
  margin-top: 4px;
}
</style>
