<script setup lang="ts">
// Add your navigation logic here
</script>

<template>
    <header>
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/deals">Deals</router-link>
            <router-link to="/cart">Cart</router-link>
        </nav>
    </header>
</template>

<style scoped>
header {
    padding: 1rem;
    background-color: #333;
    color: white;
}

nav {
    display: flex;
    gap: 1rem;
}

nav a {
    color: white;
    text-decoration: none;
}

nav a:hover {
    text-decoration: underline;
}
</style>
