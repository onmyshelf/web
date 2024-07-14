<template>
  <div class="d-flex justify-content-center">
    <div class="spinner-border me-2" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <h3 v-if="info">{{ info }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    info: {},
  },
}
</script>
