<template>
  <span v-if="quantity > 1" class="badge text-bg-primary me-2">
    x{{ quantity }}
  </span>
  <span v-else-if="quantity == 0" class="badge text-bg-dark me-2">
    {{ $t("Out of stock") }}
  </span>
</template>

<script>
export default {
  props: {
    quantity: {
      type: Number,
      required: true,
    },
  },
}
</script>
