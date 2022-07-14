<template>
  <div class="container">
    <h5>Delete item {{$route.params.id}}?</h5>
    <button type="button" class="btn btn-danger" @click="deleteItem" :disabled="$demoMode()">Delete item</button>&nbsp;
    <button type="button" class="btn btn-outline-secondary" @click="goBack">Cancel</button>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      document.location.href = "/collection/" + this.$route.params.cid + "/manage/"
    },
    deleteItem() {
      this.$apiDelete("collections/" + this.$route.params.cid + "/items/" + this.$route.params.id)
        .then(() => {
          this.goBack()
        })
        .catch(() => {
          alert("Error")
        })
    }
  }
}
</script>
