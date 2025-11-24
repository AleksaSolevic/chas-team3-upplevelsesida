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
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(28, 28, 28, 0.06);
  overflow: hidden;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.card:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(28,28,28,0.12); }
.card-image img { width: 100%; height: 160px; object-fit: cover; display:block; }
.card-body { padding: 1rem; display:flex; flex-direction:column; gap:0.5rem; }
.card-top { display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem}
.title { font-size:1.05rem; margin:0; }
.title a { color: #111; text-decoration:none }
.price { color:#0a66ff; font-weight:700 }
.meta { color:#666; font-size:0.9rem; margin:0 }
.desc { color:#333; font-size:0.95rem; margin:0.25rem 0 0.5rem }
.card-bottom { display:flex; justify-content:space-between; align-items:center; gap:0.5rem }
.rating { color:#111; font-weight:600; }
.reviews { color:#777; font-weight:400; font-size:0.95rem; margin-left:6px }
.tags { display:flex; gap:0.4rem; flex-wrap:wrap }
.tag { font-size:0.8rem; background:#f2f6ff; color:#0a66ff; padding:0.25rem 0.45rem; border-radius:999px }

@media (min-width: 900px) {
  .card-image img { height: 180px }
}
</style>
