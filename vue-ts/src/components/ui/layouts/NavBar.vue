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
                <router-link to="/" @click="closeMenu">
                    <svg class="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Sun/horizon -->
                        <circle cx="20" cy="28" r="10" fill="url(#sunGradient)"/>
                        <!-- Horizon line -->
                        <rect x="4" y="28" width="32" height="12" fill="#0984e3"/>
                        <!-- Plane -->
                        <path d="M8 18L32 12L28 16L32 18L28 20L32 24L8 18Z" fill="url(#planeGradient)"/>
                        <path d="M12 19L8 22L10 19L8 18L12 19Z" fill="url(#planeGradient)"/>
                        <!-- Gradient definitions -->
                        <defs>
                            <linearGradient id="sunGradient" x1="10" y1="18" x2="30" y2="38">
                                <stop offset="0%" stop-color="#ffc107"/>
                                <stop offset="100%" stop-color="#ff6b35"/>
                            </linearGradient>
                            <linearGradient id="planeGradient" x1="8" y1="12" x2="32" y2="24">
                                <stop offset="0%" stop-color="#ff6b35"/>
                                <stop offset="100%" stop-color="#e55a2b"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <span class="logo-text">Big Deals</span>
                </router-link>
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
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--color-white);
    color: var(--color-text);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-bottom: 1px solid var(--color-border-light);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: var(--container-max);
    margin: 0 auto;
}

.logo a {
    color: var(--color-primary);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.logo-icon {
    width: 36px;
    height: 36px;
}

.logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    background: var(--gradient-sunset);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hamburger {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-sm);
    z-index: 101;
}

.hamburger span {
    width: 25px;
    height: 3px;
    background-color: var(--color-text);
    margin: 3px 0;
    transition: all var(--transition-normal);
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
    gap: var(--spacing-sm);
    align-items: center;
}

nav a {
    color: var(--color-text);
    text-decoration: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-full);
    font-weight: 500;
    transition: all var(--transition-fast);
}

nav a:hover {
    color: var(--color-primary);
    background-color: var(--color-primary-light);
}

nav a.router-link-active {
    color: var(--color-primary);
    background-color: var(--color-primary-light);
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
        background-color: var(--color-white);
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        gap: 0;
        padding-top: 5rem;
        transition: right var(--transition-normal);
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
    }

    nav.open {
        right: 0;
    }

    nav a {
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: 0;
        border-bottom: 1px solid var(--color-border-light);
    }

    nav a:hover,
    nav a.router-link-active {
        background-color: var(--color-primary-light);
    }
}

/* Mobile */
@media (max-width: 480px) {
    header {
        padding: 0.75rem var(--spacing-md);
    }

    .logo a {
        font-size: 1.25rem;
    }

    nav {
        width: 80%;
    }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
    header {
        background-color: var(--color-bg-secondary);
        border-bottom-color: var(--color-border);
    }

    nav {
        background-color: var(--color-bg-secondary);
    }
}
</style>
