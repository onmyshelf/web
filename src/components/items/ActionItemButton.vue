<template>
  <router-link
    :to="baseUrl + (item ? 'item/' + item + '/' : '') + action"
    :class="'btn btn-outline-' + (buttonStyle ? buttonStyle : 'primary') + ' ' + (small ? '' : ' me-3')"
    :title="small ? $t(label) : ''"
  >
    <i v-if="icon" :class="'bi-' + icon" /> {{ small ? "" : $t(label) }}
  </router-link>
</template>

<script>
export default {
  props: {
    action: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    buttonStyle: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    item: {
      default: "",
    },
    baseUrl: {
      type: String,
      default: "",
    },
    small: {
      default: false,
    },
  },
}
</script>
