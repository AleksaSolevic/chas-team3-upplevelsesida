<script setup lang="ts">
import NavBar from './NavBar.vue'
import Footer from './Footer.vue'
</script>

<template>
    <div class="layout">
        <NavBar />
        <main>
            <!-- This is where your page components will render -->
            <router-view />
        </main>
        <Footer/>
    </div>
</template>

<style scoped>
.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1;
    padding: 2rem;
}
</style>
