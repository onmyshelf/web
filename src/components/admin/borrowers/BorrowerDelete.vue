<template>
  <DeleteConfirm obj="borrower" :id="$route.params.id" url="borrowers">
    <p>{{ $t("Delete borrower consequences") }}</p>
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
