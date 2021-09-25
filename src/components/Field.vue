<template>
  <template v-if="!field.isCover && !field.isTitle">
    <FieldLabel v-if="!field.hideLabel" :name=name :label=field.label />
    <template v-if="value">
      <ul v-if="Array.isArray(value)">
        <li v-for="(v, k) in value" :key="k">
          <FieldValue :name="name" :field=field :value=v />
        </li>
      </ul>
      <FieldValue v-else :name="name" :field=field :value=value />
    </template>
    <FieldValue v-else-if="field.default" :name="name" :field=field :value=field.default />
  </template>
</template>

<script>
import FieldLabel from './FieldLabel.vue'
import FieldValue from './FieldValue.vue'

export default {
  components: {
    FieldLabel,
    FieldValue
  },
  props: {
    name: {
      required: true
    },
    field: {
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
