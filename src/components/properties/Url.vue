<template>
  <a :href="url">{{ linkLabel }}</a>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
  },
  computed: {
    linkLabel() {
      return this.label ? this.label : this.url
    },
  },
}
</script>
