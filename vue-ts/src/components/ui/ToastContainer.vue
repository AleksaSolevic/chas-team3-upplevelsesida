<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotifications } from '../../stores/notifications'
const notify = useNotifications()
const { toasts } = storeToRefs(notify)

function close(id: number) {
  notify.remove(id)
}
</script>

<template>
  <div class="toast-container" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" :class="['toast', t.type]">
      <div class="message">{{ t.message }}</div>
      <button class="close" @click="close(t.id)">×</button>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}
.toast {
  background: white;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  display:flex;
  align-items:center;
  gap:0.75rem;
  min-width: 220px;
}
.toast.success { border-left: 4px solid #16a34a }
.toast.info { border-left: 4px solid #0ea5e9 }
.toast.error { border-left: 4px solid #ef4444 }
.toast .message { flex:1; color:#111 }
.toast .close { background:transparent; border:0; font-size:1.1rem; cursor:pointer; color:#666 }
</style>
