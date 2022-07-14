<template>
  <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    &nbsp;
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
