<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { value: '50,000+', label: 'Happy Travelers' },
  { value: '120+', label: 'Destinations' },
  { value: '15', label: 'Years of Experience' },
  { value: '4.9', label: 'Average Rating' }
])

const values = ref([
  {
    icon: '🌍',
    title: 'Sustainable Travel',
    description: 'We partner with eco-conscious providers and offset carbon emissions for every trip booked.'
  },
  {
    icon: '❤️',
    title: 'Authentic Experiences',
    description: 'We curate experiences that connect you with local cultures, not tourist traps.'
  },
  {
    icon: '🤝',
    title: 'Community First',
    description: 'A portion of every booking supports local communities and conservation efforts.'
  },
  {
    icon: '✨',
    title: 'Unforgettable Moments',
    description: 'We believe travel should transform you. Every experience is designed to inspire.'
  }
])

const team = ref([
  { name: 'Sofia Lindgren', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { name: 'Marcus Eriksson', role: 'Head of Experiences', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { name: 'Emma Johansson', role: 'Travel Curator', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
  { name: 'Oscar Nilsson', role: 'Customer Experience', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' }
])
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Big Deals</h1>
        <p class="tagline">Crafting unforgettable journeys since 2010</p>
      </div>
    </section>

    <!-- Story Section -->
    <section class="story-section">
      <div class="story-content">
        <div class="story-text">
          <h2>Our Story</h2>
          <p class="lead">
            It all started with a backpack, a worn-out map, and an insatiable curiosity to explore the world.
          </p>
          <p>
            In 2010, our founder Sofia Lindgren returned from a life-changing solo trip through Southeast Asia. 
            She had discovered hidden temples in Cambodia, learned to cook traditional Thai dishes from a grandmother 
            in Chiang Mai, and watched the sunrise over Bagan's ancient pagodas. But what struck her most wasn't 
            the destinations—it was the connections she made along the way.
          </p>
          <p>
            Sofia realized that the best travel experiences weren't found in guidebooks or package tours. They were 
            discovered through local stories, authentic encounters, and stepping outside your comfort zone. With this 
            vision, <strong>Big Deals</strong> was born in a small Stockholm apartment.
          </p>
          <p>
            What began as a blog sharing hidden gems and local tips quickly grew into something bigger. Travelers 
            from around Sweden started reaching out, asking Sofia to plan their trips. Word spread, and soon 
            Big Deals became a full-fledged experience company, dedicated to creating meaningful journeys 
            that go beyond the ordinary.
          </p>
        </div>
        <div class="story-image">
          <img src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&h=800&fit=crop" alt="Traveler with backpack overlooking mountains" />
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section">
      <div class="mission-content">
        <h2>What We Stand For</h2>
        <p class="mission-text">
          We believe travel has the power to transform lives, bridge cultures, and create lasting memories. 
          Our mission is to make extraordinary experiences accessible to everyone—whether you're seeking 
          adventure in the Arctic wilderness, relaxation on a Mediterranean beach, or cultural immersion 
          in a bustling Asian metropolis.
        </p>
        <p class="mission-text">
          But we also believe in traveling responsibly. That's why we've committed to sustainable tourism 
          practices, partnering only with providers who share our values and giving back to the communities 
          that welcome us.
        </p>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <h2>Our Values</h2>
      <div class="values-grid">
        <div v-for="value in values" :key="value.title" class="value-card">
          <span class="value-icon">{{ value.icon }}</span>
          <h3>{{ value.title }}</h3>
          <p>{{ value.description }}</p>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <h2>Meet the Dreamers</h2>
      <p class="team-intro">
        Our passionate team of travel enthusiasts has explored over 80 countries combined. 
        We're here to help you find your next adventure.
      </p>
      <div class="team-grid">
        <div v-for="member in team" :key="member.name" class="team-member">
          <img :src="member.image" :alt="member.name" class="member-photo" />
          <h3>{{ member.name }}</h3>
          <p>{{ member.role }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready for Your Next Adventure?</h2>
        <p>Let us help you discover experiences that will stay with you forever.</p>
        <router-link to="/" class="cta-button">Explore Experiences</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  margin: calc(-1 * var(--spacing-xl)) calc(-1 * var(--spacing-md)) 0;
}

/* Hero */
.hero {
  background: var(--gradient-sunset);
  padding: 5rem var(--spacing-md);
  text-align: center;
  position: relative;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom right, transparent 49%, var(--color-bg) 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero h1 {
  color: var(--color-white);
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.tagline {
  color: rgba(255,255,255,0.95);
  font-size: 1.3rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.15);
}

/* Story Section */
.story-section {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 4rem var(--spacing-md);
}

.story-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.story-text h2 {
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.story-text h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: var(--color-primary);
  border-radius: 2px;
}

.story-text .lead {
  font-size: 1.2rem;
  color: var(--color-text);
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.story-text p {
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
}

.story-text strong {
  color: var(--color-primary);
}

.story-image img {
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
}

/* Stats Section */
.stats-section {
  background: var(--color-bg-secondary);
  padding: 3rem var(--spacing-md);
}

.stats-grid {
  max-width: var(--container-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

/* Mission Section */
.mission-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem var(--spacing-md);
  text-align: center;
}

.mission-section h2 {
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
}

.mission-text {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
}

/* Values Section */
.values-section {
  background: var(--color-bg-tertiary);
  padding: 4rem var(--spacing-md);
}

.values-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: var(--spacing-xl);
}

.values-grid {
  max-width: var(--container-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.value-card {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast);
}

.value-card:hover {
  transform: translateY(-4px);
}

.value-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: var(--spacing-md);
}

.value-card h3 {
  font-size: 1.1rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.value-card p {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Team Section */
.team-section {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 4rem var(--spacing-md);
  text-align: center;
}

.team-section h2 {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

.team-intro {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto var(--spacing-xl);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.team-member {
  text-align: center;
}

.member-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: var(--spacing-md);
  border: 4px solid var(--color-primary-light);
  transition: transform var(--transition-fast);
}

.team-member:hover .member-photo {
  transform: scale(1.05);
}

.team-member h3 {
  font-size: 1.05rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.team-member p {
  color: var(--color-primary);
  font-size: 0.9rem;
  font-weight: 500;
}

/* CTA Section */
.cta-section {
  background: var(--gradient-sunset);
  padding: 4rem var(--spacing-md);
  text-align: center;
}

.cta-content h2 {
  color: var(--color-white);
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.cta-content p {
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
  margin-bottom: var(--spacing-lg);
}

.cta-button {
  display: inline-block;
  background: var(--color-white);
  color: var(--color-primary);
  padding: 0.9rem 2rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive */
@media (max-width: 900px) {
  .story-content {
    grid-template-columns: 1fr;
  }
  
  .story-image {
    order: -1;
  }
  
  .stats-grid,
  .values-grid,
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .values-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 2rem;
  }
}
</style>
