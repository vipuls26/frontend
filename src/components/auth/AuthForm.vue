<script setup>
import BaseInput from '../baseui/BaseInput.vue'
import BaseButton from '../baseui/BaseButton.vue'

defineProps({
  fields: Array,
  form: Object,
  errors: Object,
  loading: Boolean,
  buttonText: String,
})

defineEmits(['submit'])
</script>

<template>
  <form @submit.prevent="$emit('submit')" class="space-y-4">
    <BaseInput
      v-for="field in fields"
      :key="field.name"
      :label="field.label"
      :type="field.type"
      :placeholder="field.placeholder"
      :model-value="form[field.name]"
      :error="errors[field.name]"
      @update:model-value="form[field.name] = $event"
    />

    <slot />

    <BaseButton :loading="loading" :text="buttonText" />
  </form>
</template>
