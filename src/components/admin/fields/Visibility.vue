<template>
  <select v-model="level" class="form-select" aria-label="Visibility">
    <template v-for="(name,key) in visibilityLevels" :key="key">
      <option v-if="key <= max" :value="key">{{name.label}}</option>
    </template>
  </select>
</template>

<script>
export default {
  props: {
    modelValue: {},
    max: {
      type: String,
      default: "4"
    }
  },
  inject: ['visibilityLevels'],
  computed: {
    level: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>
