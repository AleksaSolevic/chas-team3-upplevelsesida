<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useNotifications } from '../stores/notifications'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const notify = useNotifications()
const router = useRouter()

onMounted(() => {
	cart.load()
})

const items = computed(() => cart.items)
const subtotal = computed(() => cart.subtotal)
const taxes = computed(() => cart.taxes)
const total = computed(() => cart.total)

function changeQty(id: number, qty: number) {
	cart.updateQty(id, qty)
}

function remove(id: number) {
	const item = cart.items.find(i => i.id === id)
	cart.removeItem(id)
	if (item) notify.add(`${item.name} removed from cart`, 'info')
}

function clearCart() {
	cart.clear()
	notify.add('Cart cleared', 'info')
}

function proceed() {
	if (!cart.items.length) return
	// navigate to booking for the first item, pass people as sum qty
	const first = cart.items[0]
	if (!first) return
	const people = cart.items.reduce((s, i) => s + i.qty, 0)
	router.push({ path: `/Booking/${first.id}`, query: { people: String(people) } })
}
</script>

<template>
	<div class="cart-page">
		<h1>Your Cart</h1>

		<div v-if="items.length === 0" class="empty">Your cart is empty.</div>

		<div v-else class="grid">
			<div class="items">
				<div v-for="it in items" :key="it.id" class="cart-item">
					<img v-if="it.image" :src="it.image" :alt="it.name" />
					<div class="info">
						<h3>{{ it.name }}</h3>
						<p class="type">{{ it.type }}</p>
						<div class="controls">
							<label>Qty
								<select v-model.number="it.qty" @change="changeQty(it.id, it.qty)">
									<option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
								</select>
							</label>
							<button class="remove" @click="remove(it.id)">Remove</button>
						</div>
					</div>
					<div class="line-price">€{{ (it.price * it.qty).toFixed(2) }}</div>
				</div>
			</div>

			<aside class="summary">
				<div class="box">
					<div class="row"><span>Items</span><span>{{ cart.totalItems }}</span></div>
					<div class="row"><span>Subtotal</span><span>€{{ subtotal.toFixed(2) }}</span></div>
					<div class="row"><span>Taxes (est.)</span><span>€{{ taxes.toFixed(2) }}</span></div>
					<div class="row total"><strong>Total</strong><strong>€{{ total.toFixed(2) }}</strong></div>
					<div class="actions">
						<button class="btn" @click="clearCart">Clear cart</button>
						<button class="btn primary" @click="proceed">Buy now</button>
					</div>
				</div>
			</aside>
		</div>
	</div>
</template>

<style scoped>
.cart-page { max-width:1200px; margin:1.5rem auto; padding:0 1rem }
.empty { padding:2rem; text-align:center; color:#666 }
.grid { display:flex; gap:1.5rem }
.items { flex:1 }
.cart-item { display:flex; gap:1rem; align-items:center; padding:1rem; border-bottom:1px solid #eee }
.cart-item img { width:120px; height:80px; object-fit:cover; border-radius:6px }
.info { flex:1 }
.type { color:#666; font-size:0.9rem }
.controls { display:flex; gap:0.5rem; align-items:center; margin-top:0.5rem }
.remove { background:transparent; border:1px solid #ddd; padding:0.35rem 0.5rem; border-radius:6px; cursor:pointer; color:#111 }
.line-price { font-weight:700 }
.summary { width:320px; color: black }
.box { background:#fff; border:1px solid #eee; padding:1rem; border-radius:8px }
.row { display:flex; justify-content:space-between; padding:0.4rem 0 }
.total { font-size:1.15rem }
.actions { display:flex; gap:0.5rem; margin-top:1rem }
.btn { padding:0.6rem 0.8rem; border-radius:6px; border:1px solid #ddd; background:transparent; cursor:pointer; color: black}
.btn.primary { background:#0a66ff; color:#fff; border:0 }
</style>
