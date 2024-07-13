<template>
  <router-link
    :to="baseUrl + (item ? 'item/' + item + '/' : '') + 'edit'"
    :class="'btn btn-outline-primary' + (small ? '' : ' me-3')"
    :title="small ? $t('Edit') : ''"
  >
    <i class="bi-pencil"></i> {{ small ? "" : $t("Edit") }}
  </router-link>
</template>

<script>
export default {
  props: {
    item: {
      type: String,
      default: "",
    },
    baseUrl: {
      type: String,
      default: "",
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
