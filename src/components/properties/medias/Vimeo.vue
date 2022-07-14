<template>
  <iframe
    :src="'https://player.vimeo.com/video/' + vimeoID"
    width="640" height="360" frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
  ></iframe>
  <p><a :href="url" target="_blank">Watch on Vimeo.com</a></p>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  computed: {
    vimeoID() {
      // extract Vimeo ID from URL
      var regExp = /.*\/([0-9]+).*/
      return this.url.match(regExp)[1]
    },
  },
}
</script>
