<template>
  <Youtube v-if="isYoutube" :url="url" />
  <Vimeo v-else-if="isVimeo" :url="url" />
  <Allocine v-else-if="isAllocine" :url="url" />
  <video v-else :src="videoUrl" controls></video>
</template>

<script>
import Allocine from "./Allocine.vue"
import Vimeo from "./Vimeo.vue"
import Youtube from "./Youtube.vue"

export default {
  components: {
    Allocine,
    Vimeo,
    Youtube,
  },
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  computed: {
    isAllocine() {
      // check if is a Allocine url
      return this.url.match(/^.*allocine.fr.*/)
    },
    isVimeo() {
      // check if is a Vimeo url
      return this.url.match(/^.*vimeo.com.*/)
    },
    isYoutube() {
      // check if is a youtube url
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
      var match = this.url.match(regExp)
      return (match && match[7].length == 11) ? match[7] : false
    },
    videoUrl() {
      return this.$mediaUrl(this.url)
    },
  },
}
</script>
