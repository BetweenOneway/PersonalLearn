<template>
    <nav>
        <RouterLink to="/life/Comp1">
            <n-button>Load Comp1</n-button>
        </RouterLink>
        <RouterLink to="/life/Comp2">
            <n-button>Load Comp2</n-button>
        </RouterLink>
    </nav>
    <main style="border:1px solid blue;width: 200px;height: 400px;">
        <RouterView />
    </main>
</template>

<script setup>
</script>