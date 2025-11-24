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

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)

const peopleQuery = route.query.people as string | undefined
const people = ref<number>(peopleQuery ? Number(peopleQuery) || 1 : 1)

const experience = ref<Experience | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// form fields
const fullName = ref('')
const email = ref('')
const phone = ref('')

const cart = useCartStore()
const notify = useNotifications()

const subtotal = computed(() => (experience.value ? experience.value.price * people.value : 0))
const taxes = computed(() => +(subtotal.value * 0.12))
const total = computed(() => +(subtotal.value + taxes.value))

onMounted(async () => {
	try {
		const res = await fetch('/experiences.json')
		if (!res.ok) throw new Error('Failed to load experiences')
		const data: Experience[] = await res.json()
		experience.value = data.find((e) => e.id === id) ?? null
		if (!experience.value) error.value = 'Experience not found.'
	} catch (err: any) {
		error.value = err.message || String(err)
	} finally {
		loading.value = false
	}
})

function submitBooking() {
	if (!experience.value) return
	// Add to cart with selected people quantity
	cart.addItem({ id: experience.value.id, name: experience.value.name, price: experience.value.price, image: experience.value.image, type: experience.value.type }, people.value)
	notify.add(`${experience.value.name} added to cart (${people.value}×)`, 'success')
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
.booking-page { max-width:1100px; margin:1.5rem auto; padding:0 1rem }
.back { background:transparent; border:0; color:#0a66ff; cursor:pointer; margin-bottom:0.75rem }
.grid { display:flex; gap:1.5rem }
.left { flex:1 }
.summary { width:320px; color:black }
.box { background:#fff; border:1px solid #eee; padding:1rem; border-radius:8px }
.row { display:flex; justify-content:space-between; padding:0.4rem 0 }
.total { font-weight:700 }
.btn { padding:0.6rem 0.8rem; border-radius:6px; border:1px solid #ddd; background:transparent; cursor:pointer }
.btn.primary { background:#0a66ff; color:#fff; border:0 }
.muted { color:#666; font-size:0.9rem }
.left label { display:block; margin-bottom:1rem; font-weight:600; color:#222 }
.left input,
.left select {
	width:100%;
	padding:0.9rem 0.9rem;
	font-size:1rem;
	border-radius:8px;
	border:1px solid #e6e9ef;
	box-shadow: inset 0 1px 2px rgba(16,24,40,0.02);
	margin-top:0.35rem;
}
.left input::placeholder { color:#999 }
.left input:focus, .left select:focus {
	outline: none;
	border-color: #0a66ff;
	box-shadow: 0 6px 18px rgba(10,102,255,0.08);
}

/* details-specific styles */
.left .details label { color: #fff }
.left .details .label-text { display:block; font-weight:600; margin-bottom:0.35rem; color:inherit }
.left .details input,
.left .details select { width: 70%; display:block; margin-top:0.35rem }

/* fall-in animation */
.fall-enter-from { transform: translateY(-28px); opacity: 0 }
.fall-enter-active { transition: transform 360ms cubic-bezier(.2,.8,.2,1), opacity 360ms cubic-bezier(.2,.8,.2,1) }
.fall-enter-to { transform: translateY(0); opacity: 1 }
.confirmation { padding:1rem; background:#f8fffb; border:1px solid #e6ffec; border-radius:8px }
.actions { display:flex; gap:0.5rem; margin-top:1rem }
</style>
