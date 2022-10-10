<template>
  <select v-model="state" class="form-select" :aria-label="$t('Loan state')">
    <template v-for="(name, key) in $loanStates" :key="key">
      <option v-if="key != 'asked'" :value="key">
        {{ $translate(name.label) }}
      </option>
    </template>
  </select>
</template>

<script>
export default {
  props: {
    modelValue: {},
  },
  computed: {
    state: {
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
