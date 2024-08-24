<template>
  <div class="property-label">{{ labelTranslated }}:</div>
</template>

<style scoped>
.property-label {
  display: inline;
  margin-right: 0.5em;
  vertical-align: top;
}
</style>

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
        let name = this.name.replace(/_/g, " ")
        return name[0].toUpperCase() + name.slice(1)
      }
    },
  },
}
</script>
