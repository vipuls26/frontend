<script setup>
defineProps({
  loading: Boolean,
  text: String,
  type: {
    type: String,
    default: 'submit',
  },
})
</script>

<template>
  <button :type="type" :disabled="loading" class="app-button-primary w-full">
    {{ loading ? 'Please wait...' : text }}
  </button>
</template>
