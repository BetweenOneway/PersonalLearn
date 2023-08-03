var todoList={
    template:`<ul>
        <todo-item v-for="(task,i) of tasks" :key="i" :task="task" :i="i" :tasks="tasks"></todo-item>
    </ul>`,
    props:["tasks"],
    components:{
        todoItem
    }
}