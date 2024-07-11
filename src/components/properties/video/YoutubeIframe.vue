<template>
  <iframe
    :src="'https://www.youtube.com/embed/' + videoId"
    title="YouTube video player"
    width="640"
    height="360"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
      // convert youtube URL in youtube ID
      // (source: https://stackoverflow.com/a/8260383)
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
      var match = this.url.match(regExp)
      return match && match[7].length == 11 ? match[7] : false
    },
  },
}
</script>
