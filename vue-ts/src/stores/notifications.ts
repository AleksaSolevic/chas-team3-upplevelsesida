import { defineStore } from 'pinia'

interface Toast {
  id: number
  message: string
  type: 'success' | 'info' | 'error'
}

export const useNotifications = defineStore('notifications', {
  state: () => ({
    toasts: [] as Toast[],
    nextId: 1,
  }),

  actions: {
    add(message: string, type: Toast['type'] = 'success', timeout = 3500) {
      const id = this.nextId++
      this.toasts.push({ id, message, type })
      if (timeout > 0) {
        setTimeout(() => this.remove(id), timeout)
      }
      return id
    },

    remove(id: number) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },
  },
})
