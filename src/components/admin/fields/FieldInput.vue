<template>
  <div class="input-group">
    <template v-if="field.type == 'longtext'">
      <textarea v-model="value" class="form-control" rows="4"></textarea>
    </template>
    <template v-else-if="field.type == 'json'">
      <textarea v-model="value" class="form-control" rows="6"></textarea>
    </template>
    <template v-else-if="field.type == 'rating'">
      <input v-model="value" type="number" min=0 max=5 step=0.5
        class="form-control" :required=field.required>
    </template>
    <template v-else-if="field.type == 'date'">
      <input v-model="value" type="date" class="form-control" :required=field.required>
    </template>
    <template v-else-if="field.type == 'yesno'">
      <YesNo v-model="value" />
    </template>
    <MediaSelector v-else-if="field.type == 'image' || field.type == 'video'" v-model="value"
      :type="field.type" :mandatory="field.required"/>
    <input v-else-if="field.type == 'url'" v-model="value" :required=field.required
      type="text" class="form-control" placeholder="e.g. https://mywebsite.com">
    <input v-else v-model="value" :type="field.type" class="form-control" :required=field.required>
    <span v-if="field.suffix" class="input-group-text">{{field.suffix}}</span>
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
    field: {
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
