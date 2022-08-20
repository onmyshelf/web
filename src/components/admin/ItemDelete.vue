<template>
  <div class="container delete-confirm">
    <h5>
      Are you sure to delete item <strong>{{ $route.params.id }}</strong>?
    </h5>
    <p>This operation cannot be undone.</p>

    <button type="button" class="btn btn-danger" @click="deleteItem" :disabled="$demoMode()">
      Delete item
    </button>&nbsp;
    <a href="." class="btn btn-outline-secondary">Cancel</a>
  </div>
</template>

<script>
export default {
  methods: {
    deleteItem() {
      this.$apiDelete("collections/" + this.$route.params.cid + "/items/" + this.$route.params.id)
        .then(() => {
          document.location.href = "../.."
        })
        .catch(() => {
          alert("Error")
        })
    }
  }
}
</script>
