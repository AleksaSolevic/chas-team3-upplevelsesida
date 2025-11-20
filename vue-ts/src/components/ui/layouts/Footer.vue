<script setup lang="ts">

</script>

<template>
    <footer>
        <p>&copy; {{ new Date().getFullYear() }} Your Company. All rights reserved.</p>
    </footer>
</template>

<style scoped>
footer {
    padding: 0.5rem 1rem;
    background-color: #333;
    color: white;
    text-align: center;
    margin-top: auto;
}

footer p {
    margin: 0;
    font-size: 0.9rem;
}

/* Mobile */
@media (max-width: 480px) {
    footer p {
        font-size: 0.8rem;
    }
}
</style>
