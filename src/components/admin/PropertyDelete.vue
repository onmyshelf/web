<template>
  <DeleteConfirm
    obj="property"
    :id="$route.params.id"
    :url="'collections/' + $route.params.cid + '/properties'"
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
