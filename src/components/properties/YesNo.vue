<template>
  <div
    :class="'property-yesno-view property-yesno-view-' + (isTrue ? 'yes' : 'no')"
    :data-yesno-value="isTrue"
  >
    <i :class="'bi bi-' + (isTrue ? 'check-circle-fill' : 'x-circle')" />
  </div>
</template>

<style scoped>
.property-yesno-view {
  font-size: 1.6em;
}
.property-yesno-view-yes {
  color: #008000;
}
.property-yesno-view-no {
  color: #c00000;
}
</style>

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
