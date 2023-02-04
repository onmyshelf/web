<template>
  <a v-if="linked" :href="imgUrl">
    <img :src="imgUrl" :alt="cover ? 'Cover' : 'Image'" :class="classes" />
  </a>
  <img v-else :src="imgUrl" :alt="cover ? 'Cover' : 'Image'" :class="classes" />
</template>

<style scoped>
.gallery img {
  margin: 1em 0.2em;
  max-height: 80px;
}
</style>

<script>
export default {
  props: {
    url: {},
    linked: {
      type: Boolean,
      default: false,
    },
    cover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return this.cover ? "cover img-thumbnail" : ""
    },
    imgUrl() {
      if (this.url && this.url != "") {
        return this.$mediaUrl(this.url)
      } else {
        return "/assets/images/box.svg"
      }
    },
  },
}
</script>
