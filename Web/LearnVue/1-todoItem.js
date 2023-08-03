var todoItem={
    template:`<li>
        {{i+1}} - {{task}} <button @click="del">X</button>
    </li>`,
    props:["task","i","tasks"],
    methods:{
        del(){
            this.tasks.splice(this.i,1);
        }
    }
}