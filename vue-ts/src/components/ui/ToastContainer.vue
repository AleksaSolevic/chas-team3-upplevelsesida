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
  right: var(--spacing-md);
  bottom: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  z-index: 9999;
}

.toast {
  background: var(--color-bg);
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 220px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast.success {
  border-left: 4px solid var(--color-success);
}

.toast.info {
  border-left: 4px solid var(--color-info);
}

.toast.error {
  border-left: 4px solid var(--color-error);
}

.toast .message {
  flex: 1;
  color: var(--color-text);
}

.toast .close {
  background: transparent;
  border: 0;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.toast .close:hover {
  color: var(--color-text);
}
</style>
