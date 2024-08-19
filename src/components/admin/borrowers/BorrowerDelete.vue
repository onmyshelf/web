<template>
  <DeleteConfirm
    obj="borrower"
    :id="$route.params.id"
    url="borrowers"
    cancelUrl="../"
  />
</template>

<script>
import DeleteConfirm from "@/components/admin/DeleteConfirm.vue"

export default {
  components: {
    DeleteConfirm,
  },
}
</script>
