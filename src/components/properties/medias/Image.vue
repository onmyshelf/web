<template>
  <a v-if="linked" :href="imgUrl">
    <img
      :src="imgUrl"
      :alt="cover ? 'Cover' : 'Image'"
      :class="cover ? 'cover img-thumbnail' : ''"
    />
  </a>
  <img
    v-else
    :src="imgUrl"
    :alt="cover ? 'Cover' : 'Image'"
    :class="cover ? 'cover img-thumbnail' : ''"
  />
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
      default: false,
    },
    cover: {
      default: false,
    },
  },
  computed: {
    imgUrl() {
      if (this.url) {
        return this.$mediaUrl(this.url)
      } else {
        return "/assets/images/box.svg"
      }
    },
  },
}
</script>
