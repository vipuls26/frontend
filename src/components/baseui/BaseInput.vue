<script setup>
import { computed, ref } from 'vue'

import { formatErrorMessage } from '@/utils/apiResponse'

const props = defineProps({
  label: String,
  modelValue: String,
  type: String,
  error: {
    type: [String, Array, Object],
    default: '',
  },
  placeholder: String,
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }

  return props.type
})

const errorMessage = computed(() => formatErrorMessage(props.error))
</script>

<template>
  <div class="space-y-1.5">
    <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
      {{ label }}
    </label>

    <div class="relative">
      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        class="app-field"
        :class="type === 'password' ? 'pr-12' : ''"
      />

      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 hover:scale-110 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
        @click="showPassword = !showPassword"
      >
        <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-lg" />
      </button>
    </div>

    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>
