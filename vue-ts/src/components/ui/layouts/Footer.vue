<script setup lang="ts">

</script>

<template>
    <footer>
        <div class="footer-content">
            <div class="footer-brand">
                <div class="brand-logo">
                    <svg class="footer-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="28" r="10" fill="#ff6b35"/>
                        <rect x="4" y="28" width="32" height="12" fill="#0984e3"/>
                        <path d="M8 18L32 12L28 16L32 18L28 20L32 24L8 18Z" fill="#ff6b35"/>
                        <path d="M12 19L8 22L10 19L8 18L12 19Z" fill="#ff6b35"/>
                    </svg>
                    <span class="brand-name">Big Deals</span>
                </div>
                <p class="tagline">Your gateway to unforgettable adventures</p>
            </div>
            <div class="footer-links">
                <router-link to="/">Home</router-link>
                <router-link to="/deals">Deals</router-link>
                <router-link to="/about">About</router-link>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; {{ new Date().getFullYear() }} Big Deals. All rights reserved.</p>
        </div>
    </footer>
</template>

<style scoped>
footer {
    background: var(--color-bg-dark);
    color: var(--color-white);
    margin-top: auto;
}

.footer-content {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-lg);
}

.footer-brand {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.brand-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.footer-logo {
    width: 32px;
    height: 32px;
}

.brand-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
}

.tagline {
    margin: 0;
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
}

.footer-links {
    display: flex;
    gap: var(--spacing-lg);
}

.footer-links a {
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color var(--transition-fast);
}

.footer-links a:hover {
    color: var(--color-primary);
}

.footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding: var(--spacing-md);
    text-align: center;
}

.footer-bottom p {
    margin: 0;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.6);
}

/* Mobile */
@media (max-width: 600px) {
    .footer-content {
        flex-direction: column;
        text-align: center;
    }
    
    .footer-links {
        justify-content: center;
    }
}
</style>
