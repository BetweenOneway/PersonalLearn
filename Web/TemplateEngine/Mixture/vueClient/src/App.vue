<template>
  <div id="app-root">
    <nav class="navbar">
      <a href="/" class="brand">Vue3 Demo</a>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// 根组件，提供导航栏和 router-view 插槽
</script>
