<template>
  <div class="video" :data-video-source="url">
    <YoutubeIframe v-if="isYoutube" :url="url" />
    <VimeoIframe v-else-if="isVimeo" :url="url" />
    <AllocineIframe v-else-if="isAllocine" :url="url" />
    <DailymotionIframe v-else-if="isDailymotion" :url="url" />
    <video
      v-else-if="isMediaLibrary"
      :src="$mediaUrl(url)"
      class="video-player"
      controls
    ></video>
    <EmbededIframe v-else :url="url" />
  </div>
</template>

<style scoped>
.video-player {
  max-width: 640px;
}
</style>

<script>
import AllocineIframe from "./AllocineIframe.vue"
import DailymotionIframe from "./DailymotionIframe.vue"
import EmbededIframe from "./EmbededIframe.vue"
import VimeoIframe from "./VimeoIframe.vue"
import YoutubeIframe from "./YoutubeIframe.vue"

export default {
  components: {
    AllocineIframe,
    DailymotionIframe,
    EmbededIframe,
    VimeoIframe,
    YoutubeIframe,
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
