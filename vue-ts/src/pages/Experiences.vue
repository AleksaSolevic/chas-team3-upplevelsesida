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

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)

const experience = ref<Experience | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// booking options
const people = ref<number>(1)

const subtotal = computed(() => {
	if (!experience.value) return 0
	return experience.value.price * people.value
})

const taxes = computed(() => +(subtotal.value * 0.12))

const totalApprox = computed(() => +(subtotal.value + taxes.value))

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

function goToBooking() {
	router.push({ path: `/Booking/${id}`, query: { people: String(people.value) } })
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

					<div class="extra-details">
						<h4>Pricing structure</h4>
						<table>
							<tbody>
								<tr><td>Base price (per person)</td><td>€{{ experience.price.toFixed(2) }}</td></tr>
								<tr><td>Taxes & fees (est.)</td><td>€{{ (experience.price * 0.12).toFixed(2) }}</td></tr>
								<tr><td>Optional extras</td><td>Equipment rental €5–€15, Private guide +€40</td></tr>
								<tr class="total"><td>Total (approx) (per person)</td><td>€{{ (experience.price * 1.12).toFixed(2) }}</td></tr>
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

						<div class="price total">Total (approx)<div class="total-amount">€{{ totalApprox.toFixed(2) }}</div></div>
						<div class="price per">(€{{ experience.price.toFixed(2) }} per person)</div>

						<button class="book-btn" @click="goToBooking">Buy or pay now</button>
						<p class="small">Secure your spot — free cancellation up to 24 hours before.</p>
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
.experience-page { max-width:1200px; margin:1.5rem auto; padding:0 1rem }
.back { background:#0a66ff; color:#fff; border:0; padding:0.5rem 0.75rem; border-radius:6px; cursor:pointer; margin-bottom:0.75rem }
.hero img { width:100%; height:320px; object-fit:cover; border-radius:8px }
.main { display:flex; gap:1.5rem; margin-top:1rem }
.left { flex:1 }
.sidebar { width:320px }
.meta { color:#666; margin:0.25rem 0 1rem }
.description p { line-height:1.5 }
.salesman { margin-top:0.75rem; font-weight:600; color:#0b3bff }
.extra-details table { width:100%; border-collapse:collapse; margin-top:0.5rem }
.extra-details td { padding:0.5rem 0 }
.extra-details .total td { font-weight:700 }
.book { background:#fff; border:1px solid #eee; padding:1rem; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.04) }
.price { font-size:1.25rem; color:#0a66ff; margin-bottom:0.75rem }
.price.total { font-weight:700; margin-bottom:0.25rem }
.total-amount { font-size:1.5rem; margin-top:0.25rem }
.price.per { font-size:0.9rem; color:#666; margin-bottom:0.75rem }
.people-label { display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem }
.people-label select { padding:0.4rem 0.5rem; border-radius:6px; border:1px solid #ddd }
.book-btn { background:#0a66ff; color:#fff; border:0; padding:0.75rem 1rem; border-radius:6px; cursor:pointer; width:100% }
.small { color:#666; font-size:0.9rem; margin-top:0.5rem }
.tags { margin-top:1rem }
.tag-list { display:flex; gap:0.4rem; flex-wrap:wrap; margin-top:0.5rem }
.tag { background:#f2f6ff; color:#0a66ff; padding:0.3rem 0.5rem; border-radius:999px; font-size:0.85rem }

@media(max-width:900px) {
	.main { flex-direction:column }
	.sidebar { width:100% }
}
</style>
