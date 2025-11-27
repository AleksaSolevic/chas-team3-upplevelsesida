import { defineStore } from 'pinia'

interface Deal {
  id: string
  name: string
  description: string
  price: number
}

interface CartItem {
  id: number
  name: string
  price: number
  qty: number
  image?: string
  type?: string
  deals?: Deal[]
}

const STORAGE_KEY = 'cart:v1'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalItems: (state) => state.items.reduce((s, i) => s + i.qty, 0),
    subtotal: (state) => state.items.reduce((s, i) => {
      const dealsTotal = i.deals?.reduce((d, deal) => d + deal.price, 0) ?? 0
      return s + (i.price + dealsTotal) * i.qty
    }, 0),
    taxes: (state) => {
      const sub = state.items.reduce((s, i) => {
        const dealsTotal = i.deals?.reduce((d, deal) => d + deal.price, 0) ?? 0
        return s + (i.price + dealsTotal) * i.qty
      }, 0)
      return +(sub * 0.12)
    },
    total: (state) => {
      const sub = state.items.reduce((s, i) => {
        const dealsTotal = i.deals?.reduce((d, deal) => d + deal.price, 0) ?? 0
        return s + (i.price + dealsTotal) * i.qty
      }, 0)
      return +(sub * 1.12)
    },
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

    addItem(item: { id: number; name: string; price: number; image?: string; type?: string; deals?: Deal[] }, qty = 1) {
      // Create a unique identifier that includes deals
      const dealsKey = item.deals?.map(d => d.id).sort().join(',') ?? ''
      const existing = this.items.find((i) => i.id === item.id && (i.deals?.map(d => d.id).sort().join(',') ?? '') === dealsKey)

      if (existing) {
        existing.qty += qty
      } else {
        this.items.push({
          id: item.id,
          name: item.name,
          price: item.price,
          qty,
          image: item.image,
          type: item.type,
          deals: item.deals
        })
      }
      this.save()
    },

    removeItem(id: number, dealsKey?: string) {
      this.items = this.items.filter((i) => {
        if (i.id !== id) return true
        if (dealsKey !== undefined) {
          const itemDealsKey = i.deals?.map(d => d.id).sort().join(',') ?? ''
          return itemDealsKey !== dealsKey
        }
        return false
      })
      this.save()
    },

    updateQty(id: number, qty: number, dealsKey?: string) {
      const it = this.items.find((i) => {
        if (i.id !== id) return false
        if (dealsKey !== undefined) {
          const itemDealsKey = i.deals?.map(d => d.id).sort().join(',') ?? ''
          return itemDealsKey === dealsKey
        }
        return true
      })
      if (!it) return
      it.qty = qty
      if (it.qty <= 0) this.removeItem(id, dealsKey)
      else this.save()
    },

    clear() {
      this.items = []
      this.save()
    },
  },
})
