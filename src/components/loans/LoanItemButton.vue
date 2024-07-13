<template>
  <ActionItemButton
    :action="'loan/' + loan"
    buttonStyle="success"
    :icon="'box-arrow-' + (loan == 'new' ? 'up' : 'down')"
    :label="loan == 'new' ? $t('Loan item') : $t('Get back item')"
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
      default: "new",
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
