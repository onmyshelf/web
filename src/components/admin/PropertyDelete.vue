<template>
  <div class="container delete-confirm">
    <h5>
      Are you sure to delete property <strong>{{ $route.params.id }}</strong>?
    </h5>
    <p>This will delete the property definition and all values of this property in your items.</p>

    <button type="button" class="btn btn-danger" @click="deleteProperty" :disabled="$demoMode()">
      Delete property
    </button>&nbsp;
    <button type="button" class="btn btn-outline-secondary" @click="goBack">
      Cancel
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      document.location.href = "../.."
    },
    deleteProperty() {
      this.$apiDelete("collections/" + this.$route.params.cid + "/properties/" + this.$route.params.id)
        .then(() => {
          this.goBack()
        })
        .catch(() => {
          alert("Error")
        })
    },
  },
}
</script>
