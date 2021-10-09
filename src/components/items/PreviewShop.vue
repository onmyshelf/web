<template>
  <div class="col-3">
    <a :href="'item/'+item.id+'/'">
      <Image :url="coverUrl" :cover=true />
    </a>
    <a :href="'item/'+item.id+'/'">
      <h1>{{title}}</h1>
    </a>
    <a v-if="$parent.isMine" :href="'item/'+item.id+'/edit'" class="btn btn-outline-primary">
      <i class="bi-pencil"></i> Edit
    </a>
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
        return this.item.properties[this.collection.coverProperty]
      } else {
        return this.collection.cover
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
