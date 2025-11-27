<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ experience: {
  id: number
  name: string
  type: string
  price: number
  rating: number
  reviews: number
  duration: string
  image: string
  description: string
  tags: string[]
} }>()
</script>

<template>
  <article class="card">
    <router-link :to="`/experiences/${props.experience.id}`" class="card-image">
      <img :src="props.experience.image" :alt="props.experience.name" />
    </router-link>
    <div class="card-body">
      <div class="card-top">
        <h3 class="title">
          <router-link :to="`/experiences/${props.experience.id}`">{{ props.experience.name }}</router-link>
        </h3>
        <div class="price">€{{ props.experience.price }}</div>
      </div>

      <p class="meta">{{ props.experience.duration }} · <strong>{{ props.experience.type }}</strong></p>
      <p class="desc">{{ props.experience.description }}</p>

      <div class="card-bottom">
        <div class="rating">⭐ {{ props.experience.rating }} <span class="reviews">({{ props.experience.reviews }})</span></div>
        <div class="tags">
          <span v-for="tag in props.experience.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  border: 1px solid var(--color-border-light);
}
.card:hover { 
  transform: translateY(-6px); 
  box-shadow: var(--shadow-xl); 
}
.card-image { 
  position: relative; 
  overflow: hidden;
}
.card-image img { 
  width: 100%; 
  height: 180px; 
  object-fit: cover; 
  display: block;
  transition: transform var(--transition-normal);
}
.card:hover .card-image img {
  transform: scale(1.05);
}
.card-body { 
  padding: var(--spacing-md); 
  display: flex; 
  flex-direction: column; 
  gap: var(--spacing-sm); 
}
.card-top { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  gap: var(--spacing-sm);
}
.title { 
  font-size: 1.1rem; 
  margin: 0;
  font-weight: 600;
}
.title a { 
  color: var(--color-text); 
  text-decoration: none;
  transition: color var(--transition-fast);
}
.title a:hover {
  color: var(--color-primary);
}
.price { 
  background: var(--color-primary);
  color: var(--color-white); 
  font-weight: 700;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  white-space: nowrap;
}
.meta { 
  color: var(--color-text-secondary); 
  font-size: 0.9rem; 
  margin: 0;
}
.meta strong {
  color: var(--color-primary);
}
.desc { 
  color: var(--color-text-secondary); 
  font-size: 0.92rem; 
  margin: var(--spacing-xs) 0 var(--spacing-sm);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-bottom { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  gap: var(--spacing-sm);
  margin-top: auto;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border-light);
}
.rating { 
  color: var(--color-text); 
  font-weight: 600;
  font-size: 0.95rem;
}
.reviews { 
  color: var(--color-text-secondary); 
  font-weight: 400; 
  font-size: 0.9rem; 
  margin-left: 4px;
}
.tags { 
  display: flex; 
  gap: 0.35rem; 
  flex-wrap: wrap;
}
.tag { 
  font-size: 0.75rem; 
  background: var(--color-primary-light); 
  color: var(--color-primary); 
  padding: var(--spacing-xs) 0.5rem; 
  border-radius: var(--radius-full);
  font-weight: 500;
}

@media (min-width: 900px) {
  .card-image img { height: 200px; }
}
</style>
