<template>
  <div class="row">
    <div class="col-4 item-cover">
      <router-link :to="'item/' + item.id">
        <Image :url="coverUrl" :cover="true" />
      </router-link>
    </div>
    <div class="col">
      <router-link :to="'item/' + item.id + '/'">
        <h1>{{ title }}</h1>
        <h2 v-if="collection.subTitleProperty && item.properties[collection.subTitleProperty]">
          {{ item.properties[collection.subTitleProperty] }}
        </h2>
      </router-link>
      <div v-if="item.properties" class="item-preview">
        <div v-for="(property, name) of collection.properties" :key="name">
          <Property v-if="property.preview" :name="name" :property="property" :value="item.properties[name]" />
        </div>
      </div>
      <router-link v-if="$parent.isMine" :to="'item/' + item.id + '/edit'" class="btn btn-outline-primary">
        <i class="bi-pencil"></i> Edit
      </router-link>
    </div>
  </div>
</template>

<script>
import Image from "@/components/properties/medias/Image.vue"
import Property from "@/components/Property.vue"

export default {
  components: {
    Image,
    Property,
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
        return "Item " + this.item.id
      }
    },
  },
}
</script>
