<template>
  <DeleteConfirm obj="item" :id="$route.params.id" action="deleteItem" />
</template>

<script>
import DeleteConfirm from "./DeleteConfirm.vue"

export default {
  components: {
    DeleteConfirm,
  },
  methods: {
    deleteItem() {
      this.$apiDelete("collections/" + this.$route.params.cid + "/items/" + this.$route.params.id)
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
