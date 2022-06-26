<template>
  <i :class="'property-yesno-view bi bi-'+(isTrue ? 'check-circle-fill' : 'x-circle')" />
</template>

<script>
export default {
  props: {
    value: {
      default: false
    },
  },
  computed: {
    isTrue() {
      return (this.value == true) || (this.value == 1) || (this.value === 'true')
    }
  }
}
</script>
