<template>
  <div class="container">
    <loading v-if="status == 'started'" />
    <div v-if="status === true" class="alert alert-success" role="alert">
      {{ displaySuccess() }}
    </div>
    <div v-if="status === false" class="alert alert-danger" role="alert">
      {{ displayError() }}
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue"

export default {
  components: {
    Loading,
  },
  props: {
    status: {
      required: true,
    },
    success: {
      default: null,
    },
    error: {
      default: null,
    },
  },
  methods: {
    displaySuccess() {
      if (this.success) {
        return this.success
      } else {
        return this.$t("Operation successful")
      }
    },
    displayError() {
      if (this.error) {
        return this.error
      } else {
        return this.$t("An error occured") + " " + this.$t("Please retry")
      }
    }
  },
}
</script>
