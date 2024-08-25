<template>
  <select v-model="state" class="form-select" aria-label="Loan state">
    <template v-for="s in states" :key="s">
      <option :value="s">
        {{ $t("Loan state " + s) }}
      </option>
    </template>
  </select>
</template>

<script>
export default {
  props: {
    modelValue: {},
  },
  data() {
    return {
      states: ["rejected", "accepted", "lent", "returned"],
    }
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
