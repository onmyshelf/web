<template>
  <div class="property-label">{{ labelTranslated }}:</div>
</template>

<script>
export default {
  props: {
    name: {
      required: true,
    },
    property: {
      required: true,
    },
  },
  computed: {
    labelTranslated() {
      let translation = this.$translate(this.property.label)
      if (translation) {
        return translation
      } else {
        return this.name
      }
    },
  },
}
</script>
