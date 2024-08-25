<template>
  <span :class="'badge text-bg-' + style() + ' me-2'">
    {{ $t("Loan state " + state) }}
  </span>
</template>

<script>
export default {
  props: {
    state: {
      type: String,
      required: true,
    },
  },
  methods: {
    style() {
      switch (this.state) {
        case "asked":
          return "warning"

        case "rejected":
          return "secondary"

        case "accepted":
          return "info"

        case "lent":
          return "danger"

        case "returned":
          return "success"
      }
    }
  },
}
</script>
