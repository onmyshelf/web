<template>
  <a v-if="linked" :href="imgUrl">
    <img :src="imgUrl" alt="Image not found" class="cover img-thumbnail" />
  </a>
  <img v-else :src="imgUrl" alt="Image not found" class="cover img-thumbnail" />
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
    }
  },
  computed: {
    imgUrl() {
      return this.$mediaUrl(this.url)
    }
  }
}
</script>
