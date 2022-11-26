<template>
  <DeleteConfirm obj="loan" :id="$route.params.id" action="deleteLoan" />
</template>

<script>
import DeleteConfirm from "./DeleteConfirm.vue"

export default {
  components: {
    DeleteConfirm,
  },
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
