<template>
  <a :href="'item/'+item.id+'/'">
    <Cover v-if="item.fields && coverField && item.fields[coverField]" :url="item.fields[coverField]" :linked=false :title="item.fields[titleField]" />
    <Cover v-else-if="$parent.cover" :url="$parent.cover" :linked=false :title="item.fields[titleField]" />
    <Cover v-else url="/assets/images/box.svg" :linked=false :title="item.fields[titleField]" />
  </a>
</template>

<script>
import Cover from '@/components/fields/Cover.vue'

export default {
  components: {
    Cover
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    coverField() {
      return this.$parent.coverField
    },
    titleField() {
      return this.$parent.titleField
    }
  }
}
</script>
