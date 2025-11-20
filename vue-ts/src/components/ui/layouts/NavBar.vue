<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
    isMenuOpen.value = false
}
</script>

<template>
    <header>
        <div class="nav-container">
            <div class="logo">
                <router-link to="/" @click="closeMenu">Your Company</router-link>
            </div>
            <button class="hamburger" @click="toggleMenu" :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'">
                <span :class="{ open: isMenuOpen }"></span>
                <span :class="{ open: isMenuOpen }"></span>
                <span :class="{ open: isMenuOpen }"></span>
            </button>
            <nav :class="{ open: isMenuOpen }">
                <router-link to="/" @click="closeMenu">Home</router-link>
                <router-link to="/about" @click="closeMenu">About</router-link>
                <router-link to="/deals" @click="closeMenu">Deals</router-link>
                <router-link to="/experiences/1" @click="closeMenu">Experiences</router-link>
                <router-link to="/booking/1" @click="closeMenu">Booking</router-link>
                <router-link to="/cart" @click="closeMenu">Cart</router-link>
            </nav>
        </div>
    </header>
</template>

<style scoped>
header {
    padding: 1rem;
    background-color: #333;
    color: white;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

.logo a {
    color: white;
    text-decoration: none;
    font-size: 1.25rem;
    font-weight: bold;
}

.hamburger {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 101;
}

.hamburger span {
    width: 25px;
    height: 3px;
    background-color: white;
    margin: 3px 0;
    transition: all 0.3s ease;
    border-radius: 3px;
}

.hamburger span.open:nth-child(1) {
    transform: rotate(45deg) translate(9px, 9px);
}

.hamburger span.open:nth-child(2) {
    opacity: 0;
}

.hamburger span.open:nth-child(3) {
    transform: rotate(-45deg) translate(8px, -8px);
}

nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

nav a:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

nav a.router-link-active {
    background-color: rgba(255, 255, 255, 0.2);
}

/* Tablet */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }

    nav {
        position: fixed;
        top: 0;
        right: -100%;
        height: 100vh;
        width: 70%;
        max-width: 300px;
        background-color: #333;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        gap: 0;
        padding-top: 5rem;
        transition: right 0.3s ease;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
    }

    nav.open {
        right: 0;
    }

    nav a {
        padding: 1rem 1.5rem;
        border-radius: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
}

/* Mobile */
@media (max-width: 480px) {
    header {
        padding: 0.75rem;
    }

    .logo a {
        font-size: 1.1rem;
    }

    nav {
        width: 80%;
    }
}
</style>
