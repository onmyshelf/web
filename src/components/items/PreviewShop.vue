<template>
  <div class="col-lg-3 col-md-6 col-sm-12">
    <router-link :to="'item/'+item.id+'/'">
      <Image :url="coverUrl" :cover=true />
    </router-link>
    <router-link :to="'item/'+item.id+'/'">
      <h1>{{title}}</h1>
    </router-link>
    <router-link v-if="$parent.isMine" :to="'item/'+item.id+'/edit'" class="btn btn-outline-primary">
      <i class="bi-pencil"></i> Edit
    </router-link>
  </div>
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
        if (this.item.thumbnail.normal) {
          return this.item.thumbnail.normal
        } else {
          return this.item.properties[this.collection.coverProperty]
        }
      } else {
        if (this.collection.thumbnail.normal) {
          return this.collection.thumbnail.normal
        } else {
          return this.collection.cover
        }
      }
    },
    title() {
      if (this.item.properties[this.collection.titleProperty]) {
        return this.item.properties[this.collection.titleProperty]
      } else {
        return 'Item '+this.item.id
      }
    }
  }
}
</script>
