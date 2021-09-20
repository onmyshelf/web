<template>
  <a v-if="linked" :href="imgUrl">
    <img :src="imgUrl" alt="Image not found" />
  </a>
  <img v-else :src="imgUrl" alt="Image not found" />
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    linked: {
      type: Boolean,
      default: true
    },
  },
  computed: {
    imgUrl() {
      return this.$mediaUrl(this.url)
    }
  }
}
</script>
