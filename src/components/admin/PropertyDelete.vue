<template>
  <div class="container delete-confirm">
    <h5>
      {{ $t("Confirm delete property") }} <strong>{{ $route.params.id }}</strong>?
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
