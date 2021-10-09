<template>
  <div class="input-group">
    <template v-if="property.type == 'longtext'">
      <textarea v-model="value" class="form-control" rows="4"></textarea>
    </template>
    <template v-else-if="property.type == 'json'">
      <textarea v-model="value" class="form-control" rows="6"></textarea>
    </template>
    <template v-else-if="property.type == 'rating'">
      <input v-model="value" type="number" min=0 max=5 step=0.5
        class="form-control" :required=property.required>
    </template>
    <template v-else-if="property.type == 'date'">
      <input v-model="value" type="date" class="form-control" :required=property.required>
    </template>
    <template v-else-if="property.type == 'yesno'">
      <YesNo v-model="value" />
    </template>
    <MediaSelector v-else-if="property.type == 'image' || property.type == 'video'" v-model="value"
      :type="property.type" :mandatory="property.required"/>
    <input v-else-if="property.type == 'url'" v-model="value" :required=property.required
      type="text" class="form-control" placeholder="e.g. https://mywebsite.com">
    <input v-else v-model="value" :type="property.type" class="form-control" :required=property.required>
    <span v-if="property.suffix" class="input-group-text">{{property.suffix}}</span>
  </div>
</template>

<script>
import MediaSelector from './MediaSelector.vue'
import YesNo from './YesNo.vue'

export default {
  components: {
    MediaSelector,
    YesNo
  },
  props: {
    property: {
      required: true
    },
    modelValue: {}
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>
