import { defineStore } from 'pinia'

interface CartItem {
  id: number
  name: string
  price: number
  qty: number
  image?: string
  type?: string
}

const STORAGE_KEY = 'cart:v1'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalItems: (state) => state.items.reduce((s, i) => s + i.qty, 0),
    subtotal: (state) => state.items.reduce((s, i) => s + i.price * i.qty, 0),
    taxes: (state) => +(state.items.reduce((s, i) => s + i.price * i.qty, 0) * 0.12),
    total: (state) => +(state.items.reduce((s, i) => s + i.price * i.qty, 0) * 1.12),
  },

  actions: {
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) this.items = JSON.parse(raw)
      } catch (e) {
        this.items = []
      }
    },

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      } catch (e) {
        // ignore
      }
    },

    addItem(item: { id: number; name: string; price: number; image?: string; type?: string }, qty = 1) {
      const existing = this.items.find((i) => i.id === item.id)
      if (existing) {
        existing.qty += qty
      } else {
        this.items.push({ id: item.id, name: item.name, price: item.price, qty, image: item.image, type: item.type })
      }
      this.save()
    },

    removeItem(id: number) {
      this.items = this.items.filter((i) => i.id !== id)
      this.save()
    },

    updateQty(id: number, qty: number) {
      const it = this.items.find((i) => i.id === id)
      if (!it) return
      it.qty = qty
      if (it.qty <= 0) this.removeItem(id)
      else this.save()
    },

    clear() {
      this.items = []
      this.save()
    },
  },
})
