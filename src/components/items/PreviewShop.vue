<template>
  <div
    v-if="!$parent.search || title.toLowerCase().includes($parent.search.toLowerCase())"
    class="item col-lg-3 col-md-6 col-sm-12 mb-3"
  >
    <router-link :to="'item/' + item.id + '/'">
      <Image :url="coverUrl" :cover="true" />
    </router-link>
    <router-link :to="'item/' + item.id + '/'">
      <h1>{{ title }}</h1>
    </router-link>
    <div v-if="$parent.isMine" class="mt-3">
      <Visibility :level="item.visibility > $parent.collection.visibility ? item.visibility : $parent.collection.visibility" />
      &nbsp;
      <router-link :to="'item/' + item.id + '/edit'" class="btn btn-outline-primary">
        <i class="bi-pencil"></i> Edit
      </router-link>
    </div>
  </div>
</template>

<script>
import Image from "@/components/properties/medias/Image.vue"
import Visibility from "@/components/properties/Visibility.vue"

export default {
  components: {
    Image,
    Visibility,
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
