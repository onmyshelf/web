<template>
  <a :href="'item/'+item.id+'/'">
    <Image :url="coverUrl" :title="item.properties[collection.titleProperty]" :cover=true />
  </a>
</template>

<script>
import Image from '@/components/properties/medias/Image.vue'

export default {
  components: {
    Image
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    collection() {
      return this.$parent.collection
    },
    coverUrl() {
      if (this.item.properties[this.collection.coverProperty]) {
        return this.item.properties[this.collection.coverProperty]
      } else {
        return this.collection.cover
      }
    }
  }
}
</script>
