<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useNotifications } from '../stores/notifications'

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

const peopleQuery = route.query.people as string | undefined
const dealsQuery = route.query.deals as string | undefined

const people = ref<number>(peopleQuery ? Number(peopleQuery) || 1 : 1)

const experience = ref<Experience | null>(null)
const selectedDeals = ref<Deal[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// form fields
const fullName = ref('')
const email = ref('')
const phone = ref('')

const cart = useCartStore()
const notify = useNotifications()

// Calculate deals total
const dealsTotal = computed(() => selectedDeals.value.reduce((sum, deal) => sum + deal.price, 0))

const subtotal = computed(() => (experience.value ? (experience.value.price + dealsTotal.value) * people.value : 0))
const taxes = computed(() => +(subtotal.value * 0.12))
const total = computed(() => +(subtotal.value + taxes.value))

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
		} else if (dealsQuery) {
			// Parse selected deal IDs from query params
			const selectedDealIds = dealsQuery.split(',')
			const experienceDeals = dealsData.find(d => d.experienceId === id)
			
			if (experienceDeals) {
				selectedDeals.value = experienceDeals.deals.filter(deal => 
					selectedDealIds.includes(deal.id)
				)
			}
		}
	} catch (err: any) {
		error.value = err.message || String(err)
	} finally {
		loading.value = false
	}
})

function submitBooking() {
	if (!experience.value) return
	// Add to cart with selected people quantity and deals
	cart.addItem({ 
		id: experience.value.id, 
		name: experience.value.name, 
		price: experience.value.price, 
		image: experience.value.image, 
		type: experience.value.type,
		deals: selectedDeals.value.length > 0 ? selectedDeals.value : undefined
	}, people.value)
	
	const dealsText = selectedDeals.value.length > 0 
		? ` with ${selectedDeals.value.length} add-on${selectedDeals.value.length > 1 ? 's' : ''}`
		: ''
	notify.add(`${experience.value.name}${dealsText} added to cart (${people.value}×)`, 'success')
	// Navigate to cart where payment/checkout will be handled
	router.push('/Cart')
}

function backToExperience() {
	router.back()
}

</script>

<template>
	<div class="booking-page">
		<button class="back" @click="backToExperience">← Back</button>

		<div v-if="loading">Loading…</div>
		<div v-else-if="error">{{ error }}</div>

		<div v-else-if="experience">
			<h1>Booking — {{ experience.name }}</h1>
			<p class="meta">{{ experience.duration }} · <strong>{{ experience.type }}</strong></p>

			<div class="grid">
				<transition name="fall" appear>
					<div class="left">
					<h3>Attendees</h3>
					<label>People
						<select v-model.number="people">
							<option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
						</select>
					</label>

					<h3>Your details</h3>
					<div class="details">
						<label>
							<span class="label-text">Full name</span>
							<input v-model="fullName" placeholder="Optional" />
						</label>
						<label>
							<span class="label-text">Email</span>
							<input v-model="email" placeholder="Optional" />
						</label>
						<label>
							<span class="label-text">Phone</span>
							<input v-model="phone" placeholder="Optional" />
						</label>
					</div>

					</div>
				</transition>

				<aside class="summary">
					<div class="box">
						<div class="row"><span>Price per person</span><span>€{{ experience.price.toFixed(2) }}</span></div>
						
						<!-- Selected deals -->
						<div v-if="selectedDeals.length > 0" class="deals-section">
							<div class="deals-header">Add-ons (per person)</div>
							<div 
								v-for="deal in selectedDeals" 
								:key="deal.id" 
								class="row deal-row"
							>
								<span class="deal-name">{{ deal.name }}</span>
								<span>€{{ deal.price.toFixed(2) }}</span>
							</div>
							<div class="row subtotal-row">
								<span>Add-ons subtotal</span>
								<span>€{{ dealsTotal.toFixed(2) }}</span>
							</div>
						</div>
						
						<div class="row"><span>People</span><span>{{ people }}</span></div>
						<div class="row"><span>Subtotal</span><span>€{{ subtotal.toFixed(2) }}</span></div>
						<div class="row"><span>Taxes (est.)</span><span>€{{ taxes.toFixed(2) }}</span></div>
						<div class="row total"><strong>Total</strong><strong>€{{ total.toFixed(2) }}</strong></div>

						<button class="btn primary" @click="submitBooking">Confirm booking</button>
					</div>
				</aside>
			</div>
		</div>

		<!-- confirmation UI removed: Booking now redirects to the cart after adding items -->
	</div>
</template>

<style scoped>
.booking-page { 
  max-width: 1100px; 
  margin: var(--spacing-lg) auto; 
  padding: 0 var(--spacing-md);
}
.back { 
  background: transparent; 
  border: 0; 
  color: var(--color-primary); 
  cursor: pointer; 
  margin-bottom: 0.75rem;
  padding: var(--spacing-sm) 0;
  font-weight: 500;
}
.back:hover {
  color: var(--color-primary-hover);
}
h1 {
  color: var(--color-text);
  font-size: 1.75rem;
  margin-bottom: var(--spacing-sm);
}
.meta {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}
.grid { 
  display: flex; 
  gap: var(--spacing-lg);
}
.left { flex: 1; }
.left h3 {
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}
.summary { 
  width: 320px;
}
.box { 
  background: var(--color-bg); 
  border: 1px solid var(--color-border-light); 
  padding: var(--spacing-md); 
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
.row { 
  display: flex; 
  justify-content: space-between; 
  padding: 0.4rem 0;
  color: var(--color-text);
}
.total { font-weight: 700; }
.btn { 
  padding: 0.6rem 0.8rem; 
  border-radius: var(--radius-md); 
  border: 1px solid var(--color-border); 
  background: transparent; 
  cursor: pointer;
  color: var(--color-text);
  transition: all var(--transition-fast);
}
.btn.primary { 
  background: var(--color-primary); 
  color: var(--color-white); 
  border: 0; 
  width: 100%; 
  margin-top: var(--spacing-md);
  font-weight: 600;
}
.btn.primary:hover {
  background: var(--color-primary-hover);
}
.muted { 
  color: var(--color-text-secondary); 
  font-size: 0.9rem;
}
.left label { 
  display: block; 
  margin-bottom: var(--spacing-md); 
  font-weight: 600; 
  color: var(--color-text);
}
.left input,
.left select {
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  margin-top: 0.35rem;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.left input::placeholder { 
  color: var(--color-text-muted);
}
.left input:focus, .left select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(10, 102, 255, 0.1);
}

/* details-specific styles */
.left .details label { 
  color: var(--color-text);
}
.left .details .label-text { 
  display: block; 
  font-weight: 600; 
  margin-bottom: 0.35rem; 
  color: inherit;
}
.left .details input,
.left .details select { 
  width: 70%; 
  display: block; 
  margin-top: 0.35rem;
}

/* Deals section styles */
.deals-section {
  margin: var(--spacing-sm) 0;
  padding: 0.75rem;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.deals-header {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.deal-row {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.deal-name {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtotal-row {
  font-weight: 600;
  border-top: 1px dashed var(--color-border);
  margin-top: var(--spacing-xs);
  padding-top: var(--spacing-sm);
  color: var(--color-text);
}

/* fall-in animation */
.fall-enter-from { transform: translateY(-28px); opacity: 0; }
.fall-enter-active { transition: transform 360ms cubic-bezier(.2,.8,.2,1), opacity 360ms cubic-bezier(.2,.8,.2,1); }
.fall-enter-to { transform: translateY(0); opacity: 1; }
.confirmation { 
  padding: var(--spacing-md); 
  background: var(--color-bg-secondary); 
  border: 1px solid var(--color-border); 
  border-radius: var(--radius-lg);
}
.actions { 
  display: flex; 
  gap: var(--spacing-sm); 
  margin-top: var(--spacing-md);
}

@media(max-width: 768px) {
  .grid { flex-direction: column; }
  .summary { width: 100%; }
  
  .left .details input,
  .left .details select { 
    width: 100%;
  }
}
</style>
