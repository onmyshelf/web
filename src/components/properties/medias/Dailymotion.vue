<template>
  <iframe
    :src="'https://www.dailymotion.com/embed/video/' + videoId"
    width="640"
    height="360"
    frameborder="0"
    allowfullscreen
  ></iframe>
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
    videoId() {
      var regExp = /.*\/([a-z0-9]+).*/
      return this.url.match(regExp)[1]
    },
  },
}
</script>
