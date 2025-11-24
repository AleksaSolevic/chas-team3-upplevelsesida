<script setup lang="ts">
import NavBar from './NavBar.vue'
import Footer from './Footer.vue'
import ToastContainer from '../ToastContainer.vue'
</script>

<template>
    <div class="layout">
        <NavBar />
        <main>
            <!-- This is where your page components will render -->
            <router-view />
        </main>
        <ToastContainer />
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
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

/* Tablet */
@media (max-width: 768px) {
    main {
        padding: 1.5rem;
    }
}

/* Mobile */
@media (max-width: 480px) {
    main {
        padding: 1rem;
    }
}
</style>
