<template>
  <div class="home">
    <ModuleA />
  </div>
</template>

<script>
// @ is an alias to /src
import ModuleA from '@/components/ModuleA.vue'

export default {
  name: 'HomeView',
  components: {
    ModuleA
  }
}
</script>
