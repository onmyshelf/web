<template>
  <div class="field-label">
    {{labelTranslated}}:
  </div>
</template>

<script>
export default {
  props: {
    name: {
      required: true
    },
    label: {},
  },
  computed: {
    labelTranslated() {
      let translation = this.$translate(this.label)
      if (translation) {
        return translation
      } else {
        return this.name
      }
    }
  }
}
</script>
