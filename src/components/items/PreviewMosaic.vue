<template>
  <a :href="'#item-' + item.id" @click="$parent.getItem(item.id)">
    <ImageView :url="cover" :title="title" cover="true" />
  </a>
</template>

<script>
import ImageView from "@/components/properties/ImageView.vue"

export default {
  components: {
    ImageView,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {},
  },
}
</script>
