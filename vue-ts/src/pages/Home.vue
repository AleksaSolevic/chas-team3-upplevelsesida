<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ExperienceCard from '../components/ui/ExperienceCard.vue'

interface Experience {
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
}

const experiences = ref<Experience[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const searchQuery = ref('')
const selectedTypes = ref<string[]>([])

onMounted(async () => {
	try {
		const res = await fetch('/experiences.json')
		if (!res.ok) throw new Error('Failed to load experiences')
		experiences.value = await res.json()
	} catch (err: any) {
		error.value = err.message || String(err)
	} finally {
		loading.value = false
	}
})

const allTypes = computed(() => {
	const set = new Set<string>()
	experiences.value.forEach((e) => set.add(e.type))
	return Array.from(set)
})

function toggleType(t: string) {
	const idx = selectedTypes.value.indexOf(t)
	if (idx >= 0) selectedTypes.value.splice(idx, 1)
	else selectedTypes.value.push(t)
}

function clearFilters() {
	selectedTypes.value = []
	searchQuery.value = ''
}

const filtered = computed(() => {
	const q = searchQuery.value.trim().toLowerCase()
	return experiences.value.filter((e) => {
		if (selectedTypes.value.length && !selectedTypes.value.includes(e.type)) return false
		if (!q) return true
		return e.name.toLowerCase().includes(q) || (e.description && e.description.toLowerCase().includes(q))
	})
})
</script>

<template>
	<div class="home">
		<!-- Hero Section -->
		<section class="hero">
			<div class="hero-content">
				<h1>Discover Unforgettable Experiences</h1>
				<p>From adventure to relaxation — find your perfect getaway</p>
			</div>
		</section>

		<!-- Search Section -->
		<section class="search-section">
			<div class="search-card">
				<div class="search-controls">
					<input v-model="searchQuery" type="search" placeholder="Search experiences, e.g. 'kayak'" aria-label="Search experiences" />
					<button class="search-btn">Search</button>
				</div>
				<div class="filters">
					<template v-for="t in allTypes" :key="t">
						<button
							:class="['chip', { active: selectedTypes.includes(t) } ]"
							@click="toggleType(t)">
							{{ t }}
						</button>
					</template>
					<button class="clear" v-if="selectedTypes.length || searchQuery" @click="clearFilters">✕</button>
				</div>
			</div>
			<div class="results-info">
				<div v-if="loading">Loading experiences…</div>
				<div v-else-if="error">Error: {{ error }}</div>
				<div v-else>{{ filtered.length }} experiences found</div>
			</div>
		</section>

		<section class="grid">
			<div v-if="!loading && !error && filtered.length === 0" class="empty">No experiences match your search/filters.</div>
			<div class="cards">
				<ExperienceCard v-for="exp in filtered" :key="exp.id" :experience="exp" />
			</div>
		</section>
	</div>
</template>

<style scoped>
/* Hero Section */
.hero {
  background: var(--gradient-sunset);
  padding: 4rem var(--spacing-md);
  text-align: center;
  margin: calc(-1 * var(--spacing-xl)) calc(-1 * var(--spacing-md)) 0;
  position: relative;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom right, transparent 49%, var(--color-bg) 50%);
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero h1 {
  color: var(--color-white);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.hero p {
  color: rgba(255,255,255,0.95);
  font-size: 1.2rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.15);
}

/* Search Section */
.search-section {
  max-width: var(--container-max);
  margin: -2rem auto var(--spacing-xl);
  padding: 0 var(--spacing-md);
  position: relative;
  z-index: 2;
}

.search-card {
  background: var(--color-bg);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
}

.search-controls {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.search-controls input[type="search"] {
  flex: 1;
  min-width: 220px;
  padding: 0.9rem var(--spacing-md);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
  font-size: 1rem;
  background: var(--color-bg);
  color: var(--color-text);
  transition: border-color var(--transition-fast);
}

.search-controls input[type="search"]:focus {
  outline: none;
  border-color: var(--color-primary);
}

.search-btn {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 0.9rem 2rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.search-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.filters {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  flex-wrap: wrap;
}

.chip {
  background: var(--color-bg-tertiary);
  border: none;
  padding: var(--spacing-sm) 0.85rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--color-text);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.chip:hover {
  background: var(--color-border);
}

.chip.active {
  background: var(--color-primary);
  color: var(--color-white);
}

.clear {
  background: transparent;
  border: 1px solid var(--color-border);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: var(--spacing-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.clear:hover {
  background: var(--color-error);
  border-color: var(--color-error);
  color: var(--color-white);
}

.results-info {
  text-align: center;
  margin-top: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

/* Grid Section */
.grid {
  max-width: var(--container-max);
  margin: var(--spacing-md) auto 4rem;
  padding: 0 var(--spacing-md);
}

.cards {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-lg);
}

.empty {
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
  text-align: center;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
}

@media(min-width: 640px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
  .hero h1 { font-size: 3rem; }
}

@media(min-width: 1000px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}

@media(max-width: 600px) {
  .search-controls {
    flex-direction: column;
  }
  .search-btn {
    width: 100%;
  }
  .hero {
    padding: 3rem var(--spacing-md);
  }
  .hero h1 {
    font-size: 1.8rem;
  }
}
</style>
