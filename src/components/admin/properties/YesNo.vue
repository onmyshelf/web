<template>
  <div class="form-check form-switch mb-3">
    <input v-model="check" class="form-check-input" type="checkbox" />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {},
  },
  computed: {
    check: {
      get() {
        return (this.modelValue == true) || (this.modelValue == 1) || (this.modelValue === 'true')
      },
      set(value) {
        this.$emit("update:modelValue", value)
      },
    },
  },
}
</script>
