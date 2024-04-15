<template>
  <DeleteConfirm
    obj="property"
    :id="$route.params.id"
    :url="'collections/' + $route.params.cid + '/properties/' + $route.params.id"
    cancelUrl="../.."
  >
    <p>{{ $t("Delete property consequences") }}</p>
  </DeleteConfirm>
</template>

<script>
import DeleteConfirm from "@/components/admin/DeleteConfirm.vue"

export default {
  components: {
    DeleteConfirm,
  },
}
</script>
