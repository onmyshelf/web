<template>
  <div :class="'property-yesno-view property-yesno-view-' + (isTrue ? 'yes' : 'no')">
    <i :class="'bi bi-' + (isTrue ? 'check-circle-fill' : 'x-circle')" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: false,
    },
  },
  computed: {
    isTrue() {
      return this.value == true || this.value == 1 || this.value === "true"
    },
  },
}
</script>
