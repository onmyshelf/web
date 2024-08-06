<template>
  <div class="list-empty">
    <img src="/assets/images/list_empty.svg" />
    <h4>{{ label }}</h4>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "Nothing here",
    },
  },
}
</script>
