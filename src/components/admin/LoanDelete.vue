<template>
  <DeleteConfirm
    obj="loan"
    :id="$route.params.id"
    :url="'collections/' + $route.params.cid + '/items/' + $route.params.iid + '/loans'"
    cancelUrl="../.."
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
