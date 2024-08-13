<template>
  <DeleteConfirm obj="user" :id="$route.params.id" url="users">
    <p>{{ $t("Delete user consequences") }}</p>
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
