<template>
  <router-link
    v-if="!$parent.search || title.toLowerCase().includes($parent.search.toLowerCase())"
    :to="'item/' + item.id + '/'"
  >
    <Image :url="coverUrl" :title="item.properties[collection.titleProperty]" :cover="true" />
  </router-link>
</template>

<script>
import Image from "@/components/properties/medias/Image.vue"

export default {
  components: {
    Image,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    collection() {
      return this.$parent.collection
    },
    coverUrl() {
      if (this.item.properties[this.collection.coverProperty]) {
        if (this.item.thumbnail.small) {
          return this.item.thumbnail.small
        } else {
          return this.item.properties[this.collection.coverProperty]
        }
      } else {
        if (this.collection.thumbnail.small) {
          return this.collection.thumbnail.small
        } else {
          return this.collection.cover
        }
      }
    },
    title() {
      if (this.item.properties[this.collection.titleProperty]) {
        return this.item.properties[this.collection.titleProperty]
      } else {
        return "Item " + this.item.id
      }
    },
  },
}
</script>
