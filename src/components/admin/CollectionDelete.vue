<template>
  <DeleteConfirm obj="collection" :id="$route.params.cid" action="deleteCollection" />
</template>

<script>
import DeleteConfirm from "./DeleteConfirm.vue"

export default {
  components: {
    DeleteConfirm,
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    deleteCollection() {
      this.$apiDelete("collections/" + this.$route.params.cid)
        .then(() => {
          document.location.href = "../../.."
        })
        .catch(() => {
          alert("Error, please retry")
        })
    },
  },
}
</script>
