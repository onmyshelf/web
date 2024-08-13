<template>
  <DeleteConfirm
    obj="collection"
    :id="$route.params.cid"
    url="collections"
    successUrl="../../.."
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
