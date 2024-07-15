<template>
  <ActionItemButton
    action="edit"
    icon="pencil"
    :label="$t('Edit')"
    :collection="collection"
    :item="item"
    :small="small"
  />
</template>

<script>
import ActionItemButton from "./ActionItemButton.vue"

export default {
  components: {
    ActionItemButton,
  },
  props: {
    collection: {
      required: true,
    },
    item: {
      required: true,
    },
    small: {
      default: false,
    },
  },
}
</script>
