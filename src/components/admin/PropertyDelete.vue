<template>
  <div class="container delete-confirm">
    <h5>
      {{ $t("Confirm delete property") }} <span class="object-id">{{ $route.params.id }}</span> ?
    </h5>
    <p>{{ $t("Delete property consequences") }}</p>

    <button type="button" class="btn btn-danger" @click="deleteProperty" :disabled="$demoMode()">
      {{ $t("Delete property") }}
    </button>&nbsp;
    <button type="button" class="btn btn-outline-secondary" @click="goBack">
      {{ $t("Cancel") }}
    </button>
  </div>
</template>

<style scoped>
.delete-confirm {
  text-align: center;
  margin-top: 100px;
}

.object-id {
  font-weight: bold;
  font-style: italic;
}
</style>

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
