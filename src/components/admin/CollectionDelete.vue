<template>
  <div class="container">
    <h5>Delete collection {{ $route.params.cid }}?</h5>
    <button @click="deleteCollection" type="button" class="btn btn-danger" :disabled="$demoMode()">
      Delete collection
    </button>&nbsp;
    <button @click="goBack" type="button" class="btn btn-outline-secondary">
      Cancel
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      document.location.href = "/"
    },
    deleteCollection() {
      // API call
      this.$apiDelete("collections/" + this.$route.params.cid)
        .then(() => {
          this.goBack()
        })
        .catch(() => {
          alert('Error')
        })
    },
  },
}
</script>
