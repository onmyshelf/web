<template>
  <input v-model="level" type="hidden" />
  <template v-for="(name, key) in $visibilityLevels" :key="key">
    <div v-if="key >= min && key <= max" class="form-check">
      <input
        type="radio"
        class="form-check-input"
        @change="level = key"
        :checked="level == key"
        :disabled="disabled != false"
      />
      <label class="form-check-label">
        <i :class="'bi-' + $visibilityLevels[key].icon" />
        {{ $translate(name.label) }}
      </label>
    </div>
  </template>
</template>

<script>
export default {
  props: {
    modelValue: {},
    min: {
      default: 0,
    },
    max: {
      default: 4,
    },
    disabled: {
      default: false,
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
