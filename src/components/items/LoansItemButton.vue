<template>
  <router-link
    :to="baseUrl + (item ? 'item/' + item + '/' : '') + '#loans'"
    :class="'btn btn-outline-success' + (small ? '' : ' me-3')"
    :title="small ? $t('Loans') : ''"
  >
    <i class="bi-box-arrow-up"></i> {{ small ? "" : $t("Loans") }}
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
