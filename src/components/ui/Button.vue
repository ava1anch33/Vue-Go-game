<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success'
    style?: Record<string, string>
    class?: string
  }>(),
  {
    type: 'primary',
    style: undefined,
    class: undefined,
  },
)
</script>

<template>
  <button :class="`button ${type} ${props.class ? props.class : ''}`" :style="style">
    <slot />
  </button>
</template>

<style scoped>
.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.button.primary {
  background-color: #007bff;
  color: white;
}

.button.secondary {
  background-color: #6c757d;
  color: white;
}

.button.tertiary {
  background-color: #e9ecef;
  color: #333;
}

.button.danger {
  background-color: #dc3545;
  color: white;
}

.button.success {
  background-color: #28a745;
  color: white;
}
</style>
