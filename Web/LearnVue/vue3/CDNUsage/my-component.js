// my-component.js
const { ref } = Vue
export default {
  setup() {
    const count = ref(3)
    return { count }
  },
  template: `<div>Count is: {{ count }}</div>`
}