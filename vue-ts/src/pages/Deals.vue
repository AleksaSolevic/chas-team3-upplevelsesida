<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

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

interface Deal {
	id: string
	name: string
	description: string
	price: number
}

interface ExperienceDeals {
	experienceId: number
	deals: Deal[]
}

interface DealWithExperience extends Deal {
	experience: Experience
}

const router = useRouter()

const experiences = ref<Experience[]>([])
const dealsData = ref<ExperienceDeals[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const searchQuery = ref('')
const selectedTypes = ref<string[]>([])

onMounted(async () => {
	try {
		const [expRes, dealsRes] = await Promise.all([
			fetch('/experiences.json'),
			fetch('/deals.json')
		])
		
		if (!expRes.ok) throw new Error('Failed to load experiences')
		if (!dealsRes.ok) throw new Error('Failed to load deals')
		
		experiences.value = await expRes.json()
		dealsData.value = await dealsRes.json()
	} catch (err: any) {
		error.value = err.message || String(err)
	} finally {
		loading.value = false
	}
})

// Get all unique experience types
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

// Combine deals with their experiences
const dealsWithExperiences = computed(() => {
	const result: DealWithExperience[] = []
	
	for (const expDeals of dealsData.value) {
		const experience = experiences.value.find(e => e.id === expDeals.experienceId)
		if (!experience) continue
		
		for (const deal of expDeals.deals) {
			result.push({
				...deal,
				experience
			})
		}
	}
	
	return result
})

// Filter deals based on search and type
const filteredDeals = computed(() => {
	const q = searchQuery.value.trim().toLowerCase()
	
	return dealsWithExperiences.value.filter((deal) => {
		// Filter by experience type
		if (selectedTypes.value.length && !selectedTypes.value.includes(deal.experience.type)) {
			return false
		}
		
		// Filter by search query
		if (!q) return true
		
		return (
			deal.name.toLowerCase().includes(q) ||
			deal.description.toLowerCase().includes(q) ||
			deal.experience.name.toLowerCase().includes(q)
		)
	})
})

// Group filtered deals by experience
const groupedDeals = computed(() => {
	const groups = new Map<number, { experience: Experience; deals: Deal[] }>()
	
	for (const deal of filteredDeals.value) {
		const expId = deal.experience.id
		if (!groups.has(expId)) {
			groups.set(expId, {
				experience: deal.experience,
				deals: []
			})
		}
		groups.get(expId)!.deals.push({
			id: deal.id,
			name: deal.name,
			description: deal.description,
			price: deal.price
		})
	}
	
	return Array.from(groups.values())
})

function goToExperience(id: number) {
	router.push(`/Experiences/${id}`)
}
</script>

<template>
	<div class="deals-page">
		<header class="page-header">
			<h1>🎁 Special Deals & Add-ons</h1>
			<p class="subtitle">Enhance your experience with these optional extras</p>
		</header>

		<section class="search-area">
			<div class="search-controls">
				<input 
					v-model="searchQuery" 
					type="search" 
					placeholder="Search deals or experiences..." 
					aria-label="Search deals" 
				/>
				<div class="filters">
					<template v-for="t in allTypes" :key="t">
						<button
							:class="['chip', { active: selectedTypes.includes(t) }]"
							@click="toggleType(t)">
							{{ t }}
						</button>
					</template>
					<button class="clear" v-if="selectedTypes.length || searchQuery" @click="clearFilters">
						Clear
					</button>
				</div>
			</div>
			<div class="results-info">
				<div v-if="loading">Loading deals…</div>
				<div v-else-if="error">Error: {{ error }}</div>
				<div v-else>{{ filteredDeals.length }} deals across {{ groupedDeals.length }} experiences</div>
			</div>
		</section>

		<section class="deals-content">
			<div v-if="loading" class="loading-state">
				<div class="spinner"></div>
				<p>Loading amazing deals...</p>
			</div>

			<div v-else-if="error" class="error-state">
				<p>{{ error }}</p>
			</div>

			<div v-else-if="groupedDeals.length === 0" class="empty-state">
				<p>No deals match your search/filters.</p>
			</div>

			<div v-else class="deals-grid">
				<article 
					v-for="group in groupedDeals" 
					:key="group.experience.id" 
					class="experience-deals-card"
				>
					<div class="experience-header" @click="goToExperience(group.experience.id)">
						<img 
							:src="group.experience.image" 
							:alt="group.experience.name" 
							class="experience-image"
						/>
						<div class="experience-info">
							<span class="experience-type">{{ group.experience.type }}</span>
							<h2>{{ group.experience.name }}</h2>
							<div class="experience-meta">
								<span class="rating">⭐ {{ group.experience.rating }}</span>
								<span class="duration">{{ group.experience.duration }}</span>
								<span class="base-price">From €{{ group.experience.price }}</span>
							</div>
						</div>
					</div>

					<div class="deals-list">
						<h3>Available Add-ons</h3>
						<div 
							v-for="deal in group.deals" 
							:key="deal.id" 
							class="deal-item"
						>
							<div class="deal-info">
								<h4>{{ deal.name }}</h4>
								<p>{{ deal.description }}</p>
							</div>
							<div class="deal-price">
								<span class="price">+€{{ deal.price }}</span>
							</div>
						</div>
					</div>

					<div class="card-footer">
						<button class="view-experience-btn" @click="goToExperience(group.experience.id)">
							View Experience →
						</button>
					</div>
				</article>
			</div>
		</section>
	</div>
</template>

<style scoped>
.deals-page {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--spacing-md) 4rem;
}

.page-header {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.page-header h1 {
  font-size: 2.5rem;
  margin: 0 0 var(--spacing-sm);
  color: var(--color-text);
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  margin: 0;
}

/* Search Area */
.search-area {
  margin-bottom: var(--spacing-xl);
}

.search-controls {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.search-controls input[type="search"] {
  flex: 1;
  min-width: 220px;
  padding: 0.8rem var(--spacing-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  font-size: 1rem;
  background: var(--color-bg);
  color: var(--color-text);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.search-controls input[type="search"]:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(10, 102, 255, 0.1);
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
  padding: var(--spacing-sm) 0.75rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--color-text);
  font-size: 0.9rem;
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
  padding: 0.45rem 0.6rem;
  border-radius: var(--radius-md);
  margin-left: var(--spacing-sm);
  cursor: pointer;
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.clear:hover {
  background: var(--color-bg-tertiary);
}

.results-info {
  margin-top: 0.75rem;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

/* States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem var(--spacing-xl);
  color: var(--color-text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-bg-tertiary);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  margin: 0 auto var(--spacing-md);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Deals Grid */
.deals-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-lg);
}

@media (min-width: 768px) {
  .deals-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1100px) {
  .deals-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Experience Deals Card */
.experience-deals-card {
  background: var(--color-bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  display: flex;
  flex-direction: column;
}

.experience-deals-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.experience-header {
  position: relative;
  cursor: pointer;
}

.experience-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.experience-info {
  padding: var(--spacing-md);
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: var(--color-white);
}

.experience-type {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
}

.experience-info h2 {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xs);
  line-height: 1.3;
  color: var(--color-white);
}

.experience-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.85rem;
  opacity: 0.9;
}

.experience-meta .rating {
  color: #ffd700;
}

.experience-meta .base-price {
  font-weight: 600;
}

/* Deals List */
.deals-list {
  padding: var(--spacing-md);
  flex: 1;
}

.deals-list h3 {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.75rem;
}

.deal-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-sm);
  gap: 0.75rem;
}

.deal-item:last-child {
  margin-bottom: 0;
}

.deal-info {
  flex: 1;
}

.deal-info h4 {
  font-size: 0.95rem;
  margin: 0 0 var(--spacing-xs);
  color: var(--color-text);
}

.deal-info p {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.4;
}

.deal-price {
  text-align: right;
}

.deal-price .price {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1rem;
  white-space: nowrap;
}

/* Card Footer */
.card-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

.view-experience-btn {
  width: 100%;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 0.75rem var(--spacing-md);
  border-radius: var(--radius-lg);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.view-experience-btn:hover {
  background: var(--color-primary-hover);
}
</style>
