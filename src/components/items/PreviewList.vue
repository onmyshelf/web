<template>
  <div class="row">
    <div class="col-4 item-cover">
      <a :href="'item/'+item.id">
        <Image :url="coverUrl" :cover=true />
      </a>
    </div>
    <div class="col">
      <a :href="'item/'+item.id+'/'">
        <h1>{{title}}</h1>
        <h2 v-if="collection.subTitleProperty && item.properties[collection.subTitleProperty]">
          {{item.properties[collection.subTitleProperty]}}
        </h2>
      </a>
      <div v-if="item.properties" class="item-preview">
        <div v-for="(property, name) of collection.properties" :key="name">
          <Property v-if="property.preview" :name="name" :property=property :value=item.properties[name] />
        </div>
      </div>
      <a v-if="$parent.isMine" :href="'item/'+item.id+'/edit'" class="btn btn-outline-primary">
        <i class="bi-pencil"></i> Edit
      </a>
    </div>
  </div>
</template>

<script>
import Image from '@/components/properties/medias/Image.vue'
import Property from '@/components/Property.vue'

export default {
  components: {
    Image,
    Property
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
