<template>
  <div class="container delete-confirm">
    <h5>
      {{ $t("Confirm delete loan") }} <strong>{{ $route.params.id }}</strong>?
    </h5>
    <p>{{ $t("Operation cannot be undone") }}</p>

    <button type="button" class="btn btn-danger" @click="deleteLoan" :disabled="$demoMode()">
      {{ $t("Delete loan") }}
    </button>&nbsp;
    <a href="../../" class="btn btn-outline-secondary">{{ $t("Cancel") }}</a>
  </div>
</template>

<script>
export default {
  methods: {
    deleteLoan() {
      this.$apiDelete("collections/" + this.$route.params.cid + "/items/" + this.$route.params.iid + "/loans/" + this.$route.params.id)
        .then(() => {
          document.location.href = "../.."
        })
        .catch(() => {
          alert("Error")
        })
    },
  },
}
</script>
