import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    age:23,
    car:"七手的QQ"
  },
  getters: {
    getAge(state){
        return state.age;
    },
    getCar(state){
        return state.car;
    }
  },
  mutations: {
    updateCar(state){
        state.car="三手夏利";
    },
    updateAge(state,age){
        state.age = age;
    },
    clear(state){
        state.age=0;
    }
  },
  actions: {
    //context上下文对象=>store存储对象
    modifyAge:(context)=>{
        setTimeout(()=>{
            context.commit("clear")
        },500)
    }
  },
  modules: {
  }
})
