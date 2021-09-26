<template>
  <a :href="'item/'+item.id+'/'">
    <Image :url="coverUrl" :title="item.fields[collection.titleField]" :cover=true />
  </a>
</template>

<script>
import Image from '@/components/fields/medias/Image.vue'

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
      if (this.item.fields[this.collection.coverField]) {
        return this.item.fields[this.collection.coverField]
      } else {
        return this.collection.cover
      }
    }
  }
}
</script>
