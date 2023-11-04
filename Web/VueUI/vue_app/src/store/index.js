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
  },
  actions: {
  },
  modules: {
  }
})
