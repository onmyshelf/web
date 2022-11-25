<template>
  <div class="error">
    <img :src="'/assets/images/error_' + status + '.svg'" />
    <h1 v-if="status == 404">{{ $t("Page not found") }}</h1>
    <h1 v-else>{{ $t("An error occured") }} {{ $t("Please retry") }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: Number,
      default: 500,
    },
  },
}
</script>
