<template>
  <template v-if="!property.isCover && !property.isTitle && !property.isSubTitle">
    <PropertyLabel :name=name :property=property />
    <template v-if="value">
      <ul v-if="Array.isArray(value)">
        <li v-for="(v, k) in value" :key="k">
          <PropertyValue :name="name" :property=property :value=v />
        </li>
      </ul>
      <PropertyValue v-else :name="name" :property=property :value=value />
    </template>
    <PropertyValue v-else-if="property.default" :name="name" :property=property :value=property.default />
  </template>
</template>

<script>
import PropertyLabel from './PropertyLabel.vue'
import PropertyValue from './PropertyValue.vue'

export default {
  components: {
    PropertyLabel,
    PropertyValue
  },
  props: {
    name: {
      required: true
    },
    property: {
      required: true
    },
    value: {}
  },
  computed: {
    collection() {
      return this.$parent.collection
    }
  }
}
</script>
