<template>
  <div class="container delete-confirm">
    <h5>
      {{ $t("Confirm delete collection") }} <strong>{{ $route.params.cid }}</strong>?
    </h5>
    <p>{{ $t("Operation cannot be undone") }}</p>

    <button @click="deleteCollection" type="button" class="btn btn-danger" :disabled="$demoMode()">
      {{ $t("Delete collection") }}
    </button>&nbsp;
    <a href="." class="btn btn-outline-secondary">{{ $t("Cancel") }}</a>
  </div>
</template>

<script>
export default {
  methods: {
    deleteCollection() {
      this.$apiDelete("collections/" + this.$route.params.cid)
        .then(() => {
          document.location.href = "../../.."
        })
        .catch(() => {
          alert("Error")
        })
    },
  },
}
</script>
