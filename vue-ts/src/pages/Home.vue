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

// Search filters
const searchQuery = ref('')
const selectedTypes = ref<string[]>([])

// Date filters
const departureDate = ref('')
const returnDate = ref('')

// Travelers
const adults = ref(2)
const children = ref(0)
const showTravelersDropdown = ref(false)

// Get today's date in YYYY-MM-DD format for min date
const today = new Date().toISOString().split('T')[0]

// Computed min return date (must be after departure)
const minReturnDate = computed(() => {
	if (!departureDate.value) return today
	return departureDate.value
})

// Total travelers
const totalTravelers = computed(() => adults.value + children.value)

// Travelers summary text
const travelersSummary = computed(() => {
	const parts = []
	if (adults.value > 0) {
		parts.push(`${adults.value} ${adults.value === 1 ? 'Adult' : 'Adults'}`)
	}
	if (children.value > 0) {
		parts.push(`${children.value} ${children.value === 1 ? 'Child' : 'Children'}`)
	}
	return parts.join(', ') || 'Select travelers'
})

function incrementAdults() {
	if (adults.value < 10) adults.value++
}

function decrementAdults() {
	if (adults.value > 1) adults.value--
}

function incrementChildren() {
	if (children.value < 10) children.value++
}

function decrementChildren() {
	if (children.value > 0) children.value--
}

function toggleTravelersDropdown() {
	showTravelersDropdown.value = !showTravelersDropdown.value
}

function closeTravelersDropdown() {
	showTravelersDropdown.value = false
}

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

	// Close dropdown when clicking outside
	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement
		if (!target.closest('.travelers-wrapper')) {
			showTravelersDropdown.value = false
		}
	})
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
	departureDate.value = ''
	returnDate.value = ''
	adults.value = 2
	children.value = 0
}

const hasActiveFilters = computed(() => {
	return selectedTypes.value.length > 0 || 
		searchQuery.value || 
		departureDate.value || 
		returnDate.value ||
		adults.value !== 2 ||
		children.value !== 0
})

const filtered = computed(() => {
	const q = searchQuery.value.trim().toLowerCase()
	return experiences.value.filter((e) => {
		if (selectedTypes.value.length && !selectedTypes.value.includes(e.type)) return false
		if (!q) return true
		return e.name.toLowerCase().includes(q) || (e.description && e.description.toLowerCase().includes(q))
	})
})

// Calculate price per person based on travelers
function getPricePerPerson(basePrice: number) {
	// Children get 50% discount
	const adultTotal = basePrice * adults.value
	const childTotal = (basePrice * 0.5) * children.value
	return Math.round((adultTotal + childTotal) / totalTravelers.value)
}
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
				<!-- Main Search Row -->
				<div class="search-row">
					<div class="search-field destination-field">
						<label>
							<span class="field-icon">🔍</span>
							<span class="field-label">Destination / Experience</span>
						</label>
						<input 
							v-model="searchQuery" 
							type="text" 
							placeholder="Where do you want to go?" 
							aria-label="Search experiences" 
						/>
					</div>

					<div class="search-field date-field">
						<label>
							<span class="field-icon">📅</span>
							<span class="field-label">Departure</span>
						</label>
						<input 
							v-model="departureDate" 
							type="date" 
							:min="today"
							aria-label="Departure date" 
						/>
					</div>

					<div class="search-field date-field">
						<label>
							<span class="field-icon">📅</span>
							<span class="field-label">Return</span>
						</label>
						<input 
							v-model="returnDate" 
							type="date" 
							:min="minReturnDate"
							aria-label="Return date" 
						/>
					</div>

					<div class="search-field travelers-field">
						<label>
							<span class="field-icon">👥</span>
							<span class="field-label">Travelers</span>
						</label>
						<div class="travelers-wrapper">
							<button 
								type="button" 
								class="travelers-trigger" 
								@click.stop="toggleTravelersDropdown"
							>
								{{ travelersSummary }}
								<span class="dropdown-arrow">▼</span>
							</button>
							
							<div v-if="showTravelersDropdown" class="travelers-dropdown" @click.stop>
								<div class="traveler-row">
									<div class="traveler-info">
										<span class="traveler-type">Adults</span>
										<span class="traveler-desc">Age 13+</span>
									</div>
									<div class="traveler-controls">
										<button 
											type="button" 
											class="control-btn" 
											@click="decrementAdults" 
											:disabled="adults <= 1"
										>−</button>
										<span class="traveler-count">{{ adults }}</span>
										<button 
											type="button" 
											class="control-btn" 
											@click="incrementAdults"
											:disabled="adults >= 10"
										>+</button>
									</div>
								</div>
								
								<div class="traveler-row">
									<div class="traveler-info">
										<span class="traveler-type">Children</span>
										<span class="traveler-desc">Age 2-12 (50% off)</span>
									</div>
									<div class="traveler-controls">
										<button 
											type="button" 
											class="control-btn" 
											@click="decrementChildren"
											:disabled="children <= 0"
										>−</button>
										<span class="traveler-count">{{ children }}</span>
										<button 
											type="button" 
											class="control-btn" 
											@click="incrementChildren"
											:disabled="children >= 10"
										>+</button>
									</div>
								</div>

								<button type="button" class="done-btn" @click="closeTravelersDropdown">
									Done
								</button>
							</div>
						</div>
					</div>

					<button class="search-btn">
						<span class="search-btn-icon">🔍</span>
						<span>Search</span>
					</button>
				</div>

				<!-- Type Filters -->
				<div class="filters">
					<span class="filter-label">Filter by type:</span>
					<template v-for="t in allTypes" :key="t">
						<button
							:class="['chip', { active: selectedTypes.includes(t) } ]"
							@click="toggleType(t)">
							{{ t }}
						</button>
					</template>
					<button class="clear" v-if="hasActiveFilters" @click="clearFilters" title="Clear all filters">✕</button>
				</div>

				<!-- Active Filters Summary -->
				<div v-if="departureDate || returnDate || totalTravelers !== 2" class="active-filters">
					<span v-if="departureDate" class="filter-tag">
						📅 {{ new Date(departureDate).toLocaleDateString() }}
						<span v-if="returnDate"> → {{ new Date(returnDate).toLocaleDateString() }}</span>
					</span>
					<span class="filter-tag">
						👥 {{ travelersSummary }}
					</span>
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

/* Search Row - Flight booking style */
.search-row {
  display: flex;
  gap: 2px;
  background: var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
}

.search-row > :first-child {
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

.search-row > .search-btn {
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.search-field {
  flex: 1;
  background: var(--color-bg);
  padding: var(--spacing-sm) var(--spacing-md);
  min-width: 0;
}

.search-field label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.3rem;
}

.field-icon {
  font-size: 0.9rem;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.search-field input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  color: var(--color-text);
  padding: 0.4rem 0;
  outline: none;
}

.search-field input::placeholder {
  color: var(--color-text-muted);
}

.search-field input[type="date"] {
  cursor: pointer;
}

.destination-field {
  flex: 2;
}

.date-field {
  flex: 1;
}

.travelers-field {
  flex: 1.2;
  position: relative;
  z-index: 50;
}

/* Travelers Dropdown */
.travelers-wrapper {
  position: relative;
}

.travelers-trigger {
  width: 100%;
  background: transparent;
  border: none;
  font-size: 0.95rem;
  color: var(--color-text);
  padding: 0.4rem 0;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-arrow {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  transition: transform var(--transition-fast);
}

.travelers-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  min-width: 280px;
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  z-index: 9999;
}

.traveler-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.traveler-row:last-of-type {
  border-bottom: none;
  margin-bottom: var(--spacing-sm);
}

.traveler-info {
  display: flex;
  flex-direction: column;
}

.traveler-type {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.95rem;
}

.traveler-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.traveler-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.control-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  padding: 0;
}

.control-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-white);
}

.control-btn:disabled {
  border-color: var(--color-border);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.traveler-count {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
}

.done-btn {
  width: 100%;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.done-btn:hover {
  background: var(--color-primary-hover);
}

/* Search Button */
.search-btn {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: 0;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  white-space: nowrap;
}

.search-btn:hover {
  background: var(--color-primary-hover);
}

.search-btn-icon {
  font-size: 1.1rem;
}

/* Filters */
.filters {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-right: var(--spacing-xs);
}

.chip {
  background: var(--color-bg-tertiary);
  border: none;
  padding: var(--spacing-sm) 0.85rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--color-text);
  font-weight: 500;
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
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: var(--spacing-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 0.85rem;
}

.clear:hover {
  background: var(--color-error);
  border-color: var(--color-error);
  color: var(--color-white);
}

/* Active Filters Summary */
.active-filters {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
  flex-wrap: wrap;
}

.filter-tag {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 500;
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

/* Responsive Search */
@media(max-width: 900px) {
  .search-row {
    flex-wrap: wrap;
  }
  
  .destination-field {
    flex: 100%;
  }
  
  .date-field,
  .travelers-field {
    flex: 1;
  }
  
  .search-btn {
    flex: 100%;
    justify-content: center;
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }
}

@media(max-width: 600px) {
  .search-row {
    flex-direction: column;
    gap: 1px;
  }
  
  .search-field,
  .destination-field,
  .date-field,
  .travelers-field {
    flex: none;
    width: 100%;
  }
  
  .search-btn {
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }
  
  .hero {
    padding: 3rem var(--spacing-md);
  }
  
  .hero h1 {
    font-size: 1.8rem;
  }
  
  .travelers-dropdown {
    left: -50%;
    right: auto;
    min-width: 280px;
  }
}
</style>
