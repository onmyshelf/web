<template>
  <Youtube v-if="isYoutube" :url="url" />
  <Vimeo v-else-if="isVimeo" :url="url" />
  <Allocine v-else-if="isAllocine" :url="url" />
  <Dailymotion v-else-if="isDailymotion" :url="url" />
  <video v-else-if="isMediaLibrary" :src="$mediaUrl(url)" class="video-player" controls></video>
  <Embeded v-else :url="url" />
</template>

<script>
import Allocine from "./Allocine.vue"
import Dailymotion from "./Dailymotion.vue"
import Embeded from "./Embeded.vue"
import Vimeo from "./Vimeo.vue"
import Youtube from "./Youtube.vue"

export default {
  components: {
    Allocine,
    Dailymotion,
    Embeded,
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
      return this.url.match(/^.*allocine.fr.*/)
    },
    isDailymotion() {
      return this.url.match(/^.*dailymotion.com.*/)
    },
    isMediaLibrary() {
      return this.url.match(/^media:\/\//)
    },
    isVimeo() {
      return this.url.match(/^.*vimeo.com.*/)
    },
    isYoutube() {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
      var match = this.url.match(regExp)
      return (match && match[7].length == 11) ? match[7] : false
    },
  },
}
</script>
