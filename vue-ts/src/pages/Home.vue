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
		<section class="search-area">
			<div class="search-controls">
				<input v-model="searchQuery" type="search" placeholder="Search experiences, e.g. 'kayak'" aria-label="Search experiences" />
				<div class="filters">
					<template v-for="t in allTypes" :key="t">
						<button
							:class="['chip', { active: selectedTypes.includes(t) } ]"
							@click="toggleType(t)">
							{{ t }}
						</button>
					</template>
					<button class="clear" v-if="selectedTypes.length || searchQuery" @click="clearFilters">Clear</button>
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
.search-area { max-width:1200px; margin: 1.5rem auto; padding: 0 1rem; }
.search-controls { display:flex; gap:1rem; align-items:center; flex-wrap:wrap }
.search-controls input[type="search"] { flex:1; min-width:220px; padding:0.8rem 1rem; border-radius:8px; border:1px solid #e6e6e6; font-size:1rem }
.filters { display:flex; gap:0.5rem; align-items:center; }
.chip { background:#f3f4f6; border:none; padding:0.5rem 0.75rem; border-radius:20px; cursor:pointer; color:#111 }
.chip.active { background:#0a66ff; color:#fff }
.clear { background:transparent; border:1px solid #ddd; padding:0.45rem 0.6rem; border-radius:6px; margin-left:0.5rem }
.results-info { max-width:1200px; margin:0.5rem auto; padding:0 1rem; color:#444 }

.grid { max-width:1200px; margin: 1rem auto 4rem; padding: 0 1rem }
.cards { display:grid; grid-template-columns: repeat(1, 1fr); gap:1rem }
.empty { padding:2rem; color:#666; text-align:center }

@media(min-width:640px) {
	.cards { grid-template-columns: repeat(2, 1fr); }
}
@media(min-width:1000px) {
	.cards { grid-template-columns: repeat(3, 1fr); }
}
</style>
