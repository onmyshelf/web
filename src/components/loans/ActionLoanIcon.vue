<template>
  <router-link
    :to="'/collection/' + collection + '/item/' + item + '/loan/' + loan + action"
    class="me-3"
    :title="label"
  >
    <i :class="'bi-' + icon + (iconStyle ? ' text-' + iconStyle : '')" />
  </router-link>
</template>

<script>
export default {
  props: {
    action: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      required: true,
    },
    collection: {
      required: true,
    },
    item: {
      required: true,
    },
    loan: {
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    iconStyle: {
      type: String,
      default: "",
    },
  },
}
</script>
