<template>
  <router-link
    :to="'/collection/' + collection + '/item/' + item + '/' + action"
    :class="'btn btn-outline-' + (buttonStyle ? buttonStyle : 'primary') + ' ' + (small ? '' : ' me-3')"
    :title="small ? label : ''"
  >
    <i v-if="icon" :class="'bi-' + icon" /> {{ small ? "" : label }}
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
    collection: {
      required: true,
    },
    item: {
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
    small: {
      default: false,
    },
  },
}
</script>
