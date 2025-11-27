<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)

const experience = ref<Experience | null>(null)
const deals = ref<Deal[]>([])
const selectedDealIds = ref<Set<string>>(new Set())
const loading = ref(true)
const error = ref<string | null>(null)

// booking options
const people = ref<number>(1)

// Toggle deal selection
function toggleDeal(dealId: string) {
	if (selectedDealIds.value.has(dealId)) {
		selectedDealIds.value.delete(dealId)
	} else {
		selectedDealIds.value.add(dealId)
	}
	// Trigger reactivity
	selectedDealIds.value = new Set(selectedDealIds.value)
}

// Select all deals
function selectAllDeals() {
	selectedDealIds.value = new Set(deals.value.map(d => d.id))
}

// Deselect all deals
function deselectAllDeals() {
	selectedDealIds.value = new Set()
}

// Get selected deals
const selectedDeals = computed(() => {
	return deals.value.filter(d => selectedDealIds.value.has(d.id))
})

// Calculate deals total (per person)
const dealsTotal = computed(() => {
	return selectedDeals.value.reduce((sum, deal) => sum + deal.price, 0)
})

const subtotal = computed(() => {
	if (!experience.value) return 0
	return (experience.value.price + dealsTotal.value) * people.value
})

const taxes = computed(() => +(subtotal.value * 0.12))

const totalApprox = computed(() => +(subtotal.value + taxes.value))

onMounted(async () => {
	try {
		const [expRes, dealsRes] = await Promise.all([
			fetch('/experiences.json'),
			fetch('/deals.json')
		])
		
		if (!expRes.ok) throw new Error('Failed to load experiences')
		if (!dealsRes.ok) throw new Error('Failed to load deals')
		
		const expData: Experience[] = await expRes.json()
		const dealsData: ExperienceDeals[] = await dealsRes.json()
		
		experience.value = expData.find((e) => e.id === id) ?? null
		if (!experience.value) {
			error.value = 'Experience not found.'
		} else {
			// Find deals for this experience
			const experienceDeals = dealsData.find(d => d.experienceId === id)
			deals.value = experienceDeals?.deals ?? []
		}
	} catch (err: any) {
		error.value = err.message || String(err)
	} finally {
		loading.value = false
	}
})

function goToBooking() {
	const selectedDealIdsArray = Array.from(selectedDealIds.value)
	router.push({ 
		path: `/Booking/${id}`, 
		query: { 
			people: String(people.value),
			deals: selectedDealIdsArray.length > 0 ? selectedDealIdsArray.join(',') : undefined
		} 
	})
}
</script>

<template>
	<div class="experience-page">
		<button class="back" @click="$router.back()">← Back</button>

		<div v-if="loading" class="loading">Loading experience…</div>
		<div v-else-if="error" class="error">{{ error }}</div>

		<div v-else-if="experience" class="content">
			<div class="hero">
				<img :src="experience.image" :alt="experience.name" />
			</div>

			<div class="main">
				<div class="left">
					<h1>{{ experience.name }}</h1>
					<p class="meta">⭐ {{ experience.rating }} · {{ experience.reviews }} reviews · {{ experience.duration }} · <strong>{{ experience.type }}</strong></p>

					<div class="description">
						<p>{{ experience.description }}</p>
						<p class="salesman">Imagine gliding through the scenery, guided by a local expert who knows all the secret spots — no hassle, all joy. This experience is carefully designed so you get the most memorable moments without the stress: small groups, friendly guides, and flexible pick-up times. Whether you're celebrating a special occasion or simply craving a day of discovery, we've got you covered.</p>

						<h3>What's included</h3>
						<ul>
							<li>Professional local guide</li>
							<li>All necessary equipment and safety briefing</li>
							<li>Flexible cancellation up to 24 hours</li>
							<li>Small-group experience for a more personal feel</li>
						</ul>

						<h3>Important information</h3>
						<p>Wear comfortable shoes and bring a light jacket — coastal weather can change quickly. Minimum fitness level: low to moderate depending on activity.</p>
					</div>

					<!-- Deals Section -->
					<div v-if="deals.length > 0" class="deals-section">
						<div class="deals-header">
							<h3>🎁 Optional Add-ons</h3>
							<div class="deals-actions">
								<button 
									class="select-all-btn" 
									@click="selectAllDeals"
									:disabled="selectedDealIds.size === deals.length"
								>
									Select All
								</button>
								<button 
									class="deselect-all-btn" 
									@click="deselectAllDeals"
									:disabled="selectedDealIds.size === 0"
								>
									Clear All
								</button>
							</div>
						</div>
						<p class="deals-subtitle">Enhance your experience with these extras (price per person)</p>
						
						<div class="deals-list">
							<label 
								v-for="deal in deals" 
								:key="deal.id" 
								class="deal-item"
								:class="{ selected: selectedDealIds.has(deal.id) }"
							>
								<input 
									type="checkbox" 
									:checked="selectedDealIds.has(deal.id)"
									@change="toggleDeal(deal.id)"
								/>
								<div class="deal-content">
									<div class="deal-info">
										<h4>{{ deal.name }}</h4>
										<p>{{ deal.description }}</p>
									</div>
									<div class="deal-price">+€{{ deal.price }}</div>
								</div>
							</label>
						</div>

						<div v-if="selectedDeals.length > 0" class="selected-summary">
							<span>{{ selectedDeals.length }} add-on{{ selectedDeals.length > 1 ? 's' : '' }} selected</span>
							<span class="selected-total">+€{{ dealsTotal }} per person</span>
						</div>
					</div>

					<div class="extra-details">
						<h4>Pricing structure</h4>
						<table>
							<tbody>
								<tr><td>Base price (per person)</td><td>€{{ experience.price.toFixed(2) }}</td></tr>
								<tr v-if="dealsTotal > 0"><td>Selected add-ons (per person)</td><td>€{{ dealsTotal.toFixed(2) }}</td></tr>
								<tr><td>Taxes & fees (est.)</td><td>€{{ ((experience.price + dealsTotal) * 0.12).toFixed(2) }}</td></tr>
								<tr class="total"><td>Total per person (approx)</td><td>€{{ ((experience.price + dealsTotal) * 1.12).toFixed(2) }}</td></tr>
							</tbody>
						</table>
					</div>
				</div>

				<aside class="sidebar">
					<div class="book">
						<label class="people-label">People
							<select v-model.number="people">
								<option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
							</select>
						</label>

						<!-- Price breakdown in sidebar -->
						<div class="price-breakdown" v-if="selectedDeals.length > 0">
							<div class="breakdown-row">
								<span>Experience</span>
								<span>€{{ (experience.price * people).toFixed(2) }}</span>
							</div>
							<div class="breakdown-row">
								<span>Add-ons</span>
								<span>€{{ (dealsTotal * people).toFixed(2) }}</span>
							</div>
							<div class="breakdown-row">
								<span>Taxes & fees</span>
								<span>€{{ taxes.toFixed(2) }}</span>
							</div>
						</div>

						<div class="price total">Total (approx)<div class="total-amount">€{{ totalApprox.toFixed(2) }}</div></div>
						<div class="price per">(€{{ (experience.price + dealsTotal).toFixed(2) }} per person + taxes)</div>

						<button class="book-btn" @click="goToBooking">Buy or pay now</button>
						<p class="small">Secure your spot — free cancellation up to 24 hours before.</p>

						<!-- Selected deals summary -->
						<div v-if="selectedDeals.length > 0" class="sidebar-deals">
							<strong>Selected Add-ons:</strong>
							<ul>
								<li v-for="deal in selectedDeals" :key="deal.id">
									{{ deal.name }} (+€{{ deal.price }})
								</li>
							</ul>
						</div>
					</div>

					<div class="tags">
						<strong>Tags</strong>
						<div class="tag-list">
							<span v-for="t in experience.tags" :key="t" class="tag">{{ t }}</span>
						</div>
					</div>
				</aside>
			</div>
		</div>
	</div>
</template>

<style scoped>
.experience-page { 
  max-width: var(--container-max); 
  margin: var(--spacing-lg) auto; 
  padding: 0 var(--spacing-md);
}
.back { 
  background: var(--color-primary); 
  color: var(--color-white); 
  border: 0; 
  padding: var(--spacing-sm) 0.75rem; 
  border-radius: var(--radius-md); 
  cursor: pointer; 
  margin-bottom: 0.75rem;
  transition: background var(--transition-fast);
}
.back:hover {
  background: var(--color-primary-hover);
}
.hero img { 
  width: 100%; 
  height: 320px; 
  object-fit: cover; 
  border-radius: var(--radius-lg);
}
.main { 
  display: flex; 
  gap: var(--spacing-lg); 
  margin-top: var(--spacing-md);
}
.left { flex: 1; }
.sidebar { width: 320px; }
.meta { 
  color: var(--color-text-secondary); 
  margin: var(--spacing-xs) 0 var(--spacing-md);
}
.description p { line-height: 1.6; }
.description h3 {
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}
.description ul {
  padding-left: var(--spacing-lg);
  color: var(--color-text);
}
.description ul li {
  margin-bottom: var(--spacing-xs);
}
.salesman { 
  margin-top: 0.75rem; 
  font-weight: 600; 
  color: var(--color-primary);
}
.extra-details { 
  margin-top: var(--spacing-lg);
}
.extra-details h4 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}
.extra-details table { 
  width: 100%; 
  border-collapse: collapse; 
  margin-top: var(--spacing-sm);
}
.extra-details td { 
  padding: var(--spacing-sm) 0;
  color: var(--color-text);
}
.extra-details .total td { font-weight: 700; }
.book { 
  background: var(--color-bg); 
  border: 1px solid var(--color-border-light); 
  padding: var(--spacing-md); 
  border-radius: var(--radius-lg); 
  box-shadow: var(--shadow-md);
}
.price { 
  font-size: 1.25rem; 
  color: var(--color-primary); 
  margin-bottom: 0.75rem;
}
.price.total { 
  font-weight: 700; 
  margin-bottom: var(--spacing-xs);
}
.total-amount { 
  font-size: 1.5rem; 
  margin-top: var(--spacing-xs);
}
.price.per { 
  font-size: 0.9rem; 
  color: var(--color-text-secondary); 
  margin-bottom: 0.75rem;
}
.people-label { 
  display: flex; 
  align-items: center; 
  gap: var(--spacing-sm); 
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}
.people-label select { 
  padding: 0.4rem var(--spacing-sm); 
  border-radius: var(--radius-md); 
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
}
.book-btn { 
  background: var(--color-primary); 
  color: var(--color-white); 
  border: 0; 
  padding: 0.75rem var(--spacing-md); 
  border-radius: var(--radius-md); 
  cursor: pointer; 
  width: 100%;
  font-weight: 600;
  transition: background var(--transition-fast);
}
.book-btn:hover {
  background: var(--color-primary-hover);
}
.small { 
  color: var(--color-text-secondary); 
  font-size: 0.9rem; 
  margin-top: var(--spacing-sm);
}
.tags { margin-top: var(--spacing-md); }
.tags strong {
  color: var(--color-text);
}
.tag-list { 
  display: flex; 
  gap: 0.4rem; 
  flex-wrap: wrap; 
  margin-top: var(--spacing-sm);
}
.tag { 
  background: var(--color-primary-bg); 
  color: var(--color-primary); 
  padding: 0.3rem var(--spacing-sm); 
  border-radius: var(--radius-full); 
  font-size: 0.85rem;
}

/* Deals Section Styles */
.deals-section {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
}

.deals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.deals-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text);
}

.deals-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.select-all-btn,
.deselect-all-btn {
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.select-all-btn {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
}

.select-all-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.deselect-all-btn {
  background: var(--color-bg);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.deselect-all-btn:hover:not(:disabled) {
  background: var(--color-bg-tertiary);
}

.select-all-btn:disabled,
.deselect-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.deals-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: var(--spacing-sm) 0 var(--spacing-md);
}

.deals-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.deal-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: var(--spacing-md);
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.deal-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(10, 102, 255, 0.1);
}

.deal-item.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.deal-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.deal-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.deal-info {
  flex: 1;
}

.deal-info h4 {
  margin: 0 0 var(--spacing-xs);
  font-size: 1rem;
  color: var(--color-text);
}

.deal-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.deal-price {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.1rem;
  white-space: nowrap;
}

.selected-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-md);
  padding: 0.75rem var(--spacing-md);
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-lg);
  font-size: 0.95rem;
}

.selected-total {
  font-weight: 700;
}

/* Price breakdown in sidebar */
.price-breakdown {
  background: var(--color-bg-secondary);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-xs) 0;
  color: var(--color-text-secondary);
}

.breakdown-row:last-child {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

/* Selected deals in sidebar */
.sidebar-deals {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
  font-size: 0.9rem;
}

.sidebar-deals strong {
  color: var(--color-text);
}

.sidebar-deals ul {
  margin: var(--spacing-sm) 0 0;
  padding-left: 1.25rem;
}

.sidebar-deals li {
  color: var(--color-text-secondary);
  padding: 0.2rem 0;
}

.loading, .error {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
}

@media(max-width: 900px) {
  .main { flex-direction: column; }
  .sidebar { width: 100%; }
  
  .deals-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .deal-content {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>
