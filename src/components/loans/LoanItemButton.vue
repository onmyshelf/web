<template>
  <ActionItemButton
    :action="'loan/' + (loan ? loan + '?state=' + state : 'new')"
    buttonStyle="success"
    :icon="stateIcon"
    :label="stateLabel"
    :baseUrl="baseUrl"
    :item="item"
    :small="small"
  />
</template>

<script>
import ActionItemButton from "@/components/items/ActionItemButton.vue"

export default {
  components: {
    ActionItemButton,
  },
  props: {
    item: {
      default: "",
    },
    loan: {
      default: "",
    },
    state: {
      default: "lent",
    },
    baseUrl: {
      default: "",
    },
    small: {
      default: false,
    },
  },
  computed: {
    stateIcon() {
      switch (this.state) {
        case "returned":
          return "box-arrow-down"

        default:
          return "box-arrow-up"
      }
    },
    stateLabel() {
      switch (this.state) {
        case "returned":
          return this.$t("Get back item")

        default:
          return this.$t("Loan item")
      }
    },
  },
}
</script>
