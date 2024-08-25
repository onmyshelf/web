<template>
  <router-link
    :to="baseUrl + (item ? 'item/' + item + '/' : '') + 'borrow'"
    :class="'btn btn-outline-primary' + (small ? '' : ' me-3')"
    :title="small ? $t('Borrow') : ''"
  >
    <i class="bi-cart-plus" /> {{ small ? "" : $t("Borrow") }}
  </router-link>
</template>

<script>
export default {
  props: {
    item: {
      default: "",
    },
    baseUrl: {
      default: "",
    },
    small: {
      default: false,
    },
  },
}
</script>
