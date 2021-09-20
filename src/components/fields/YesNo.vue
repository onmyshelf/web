<template>
  <input type="checkbox" disabled :checked="isTrue" />
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
