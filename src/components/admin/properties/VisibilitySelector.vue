<template>
  <select v-model="level" class="form-select" :aria-label="$t('Visibility')">
    <template v-for="(name, key) in $visibilityLevels" :key="key">
      <option v-if="key >= min && key <= max" :value="key">
        {{ $translate(name.label) }}
      </option>
    </template>
  </select>
</template>

<script>
export default {
  props: {
    modelValue: {},
    max: {
      default: 4,
    },
    min: {
      default: 0,
    },
  },
  computed: {
    level: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit("update:modelValue", value)
      },
    },
  },
}
</script>
