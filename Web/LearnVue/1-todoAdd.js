var todoAdd={
    template:`<div>
    <input v-model="task"><button @click="add">+</button>
  </div>`,
    props:["tasks"],
    data(){
        return {
            task:""
        }
    },
    methods:{
        add(){
            this.tasks.push(this.task);
            this.task="";
        }
    }
}