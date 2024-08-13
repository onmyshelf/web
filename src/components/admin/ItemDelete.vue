<template>
  <DeleteConfirm
    obj="item"
    :id="$route.params.id"
    :url="'collections/' + $route.params.cid + '/items'"
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
