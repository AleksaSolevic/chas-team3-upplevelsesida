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

// Helper to get deals total for an item
function getDealsTotal(item: typeof cart.items[0]) {
	return item.deals?.reduce((sum, deal) => sum + deal.price, 0) ?? 0
}

// Helper to get item total including deals
function getItemTotal(item: typeof cart.items[0]) {
	return (item.price + getDealsTotal(item)) * item.qty
}

// Helper to get deals key for an item
function getDealsKey(item: typeof cart.items[0]) {
	return item.deals?.map(d => d.id).sort().join(',') ?? ''
}

function changeQty(item: typeof cart.items[0], qty: number) {
	cart.updateQty(item.id, qty, getDealsKey(item))
}

function remove(item: typeof cart.items[0]) {
	cart.removeItem(item.id, getDealsKey(item))
	notify.add(`${item.name} removed from cart`, 'info')
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
				<div v-for="it in items" :key="`${it.id}-${getDealsKey(it)}`" class="cart-item">
					<img v-if="it.image" :src="it.image" :alt="it.name" />
					<div class="info">
						<h3>{{ it.name }}</h3>
						<p class="type">{{ it.type }}</p>
						
						<!-- Display selected deals -->
						<div v-if="it.deals && it.deals.length > 0" class="item-deals">
							<span class="deals-label">Add-ons:</span>
							<ul>
								<li v-for="deal in it.deals" :key="deal.id">
									{{ deal.name }} (+€{{ deal.price }})
								</li>
							</ul>
						</div>
						
						<div class="controls">
							<label>Qty
								<select v-model.number="it.qty" @change="changeQty(it, it.qty)">
									<option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
								</select>
							</label>
							<button class="remove" @click="remove(it)">Remove</button>
						</div>
					</div>
					<div class="line-price-section">
						<div class="line-price">€{{ getItemTotal(it).toFixed(2) }}</div>
						<div v-if="it.deals && it.deals.length > 0" class="price-breakdown">
							<span>Base: €{{ it.price }} × {{ it.qty }}</span>
							<span>Add-ons: €{{ getDealsTotal(it) }} × {{ it.qty }}</span>
						</div>
					</div>
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
.cart-page { 
  max-width: var(--container-max); 
  margin: var(--spacing-lg) auto; 
  padding: 0 var(--spacing-md);
}
h1 {
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
}
.empty { 
  padding: var(--spacing-xl); 
  text-align: center; 
  color: var(--color-text-secondary);
}
.grid { 
  display: flex; 
  gap: var(--spacing-lg);
}
.items { flex: 1; }
.cart-item { 
  display: flex; 
  gap: var(--spacing-md); 
  align-items: flex-start; 
  padding: var(--spacing-md); 
  border-bottom: 1px solid var(--color-border-light);
}
.cart-item img { 
  width: 120px; 
  height: 80px; 
  object-fit: cover; 
  border-radius: var(--radius-md);
}
.info { flex: 1; }
.info h3 {
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs);
}
.type { 
  color: var(--color-text-secondary); 
  font-size: 0.9rem; 
  margin: var(--spacing-xs) 0;
}
.controls { 
  display: flex; 
  gap: var(--spacing-sm); 
  align-items: center; 
  margin-top: var(--spacing-sm);
}
.controls label {
  color: var(--color-text);
  font-weight: 500;
}
.controls select {
  margin-left: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
}
.remove { 
  background: transparent; 
  border: 1px solid var(--color-border); 
  padding: 0.35rem var(--spacing-sm); 
  border-radius: var(--radius-md); 
  cursor: pointer; 
  color: var(--color-text);
  transition: all var(--transition-fast);
}
.remove:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-error);
  color: var(--color-error);
}
.line-price-section { text-align: right; }
.line-price { 
  font-weight: 700; 
  font-size: 1.1rem;
  color: var(--color-text);
}
.price-breakdown { 
  font-size: 0.8rem; 
  color: var(--color-text-secondary); 
  margin-top: var(--spacing-xs);
}
.price-breakdown span { display: block; }
.summary { width: 320px; }
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
.total { font-size: 1.15rem; }
.actions { 
  display: flex; 
  gap: var(--spacing-sm); 
  margin-top: var(--spacing-md);
}
.btn { 
  padding: 0.6rem 0.8rem; 
  border-radius: var(--radius-md); 
  border: 1px solid var(--color-border); 
  background: transparent; 
  cursor: pointer; 
  color: var(--color-text);
  flex: 1;
  transition: all var(--transition-fast);
}
.btn:hover {
  background: var(--color-bg-tertiary);
}
.btn.primary { 
  background: var(--color-primary); 
  color: var(--color-white); 
  border: 0;
  font-weight: 600;
}
.btn.primary:hover {
  background: var(--color-primary-hover);
}

/* Item deals styles */
.item-deals {
  margin: var(--spacing-sm) 0;
  padding: var(--spacing-sm) 0.75rem;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
}

.deals-label {
  font-weight: 600;
  color: var(--color-primary);
  display: block;
  margin-bottom: var(--spacing-xs);
}

.item-deals ul {
  margin: 0;
  padding-left: 1.25rem;
}

.item-deals li {
  color: var(--color-text-secondary);
  padding: 0.1rem 0;
}

@media(max-width: 768px) {
  .grid { flex-direction: column; }
  .summary { width: 100%; }
  .cart-item { flex-wrap: wrap; }
  .line-price-section { 
    width: 100%; 
    text-align: left; 
    margin-top: var(--spacing-sm);
  }
}
</style>
