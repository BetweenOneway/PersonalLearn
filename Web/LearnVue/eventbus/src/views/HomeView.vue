<template>
  <div>
    <ModuleA />
    <ModuleB />
  </div>
</template>

<script>
// @ is an alias to /src
import ModuleA from '@/components/ModuleA.vue'
import ModuleB from '@/components/ModuleB.vue'

export default {
  name: 'HomeView',
  components: {
    ModuleA,
    ModuleB
  }
}
</script>
