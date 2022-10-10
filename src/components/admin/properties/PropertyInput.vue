<template>
  <div>
    <textarea
      v-if="property.type == 'longtext'"
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
      rows="4"
      class="form-control"
      :required="property.required"
    ></textarea>

    <textarea
      v-else-if="property.type == 'json'"
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
      rows="6"
      class="form-control"
      placeholder="{...}"
      :required="property.required"
    ></textarea>

    <input
      v-else-if="property.type == 'rating'"
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
      type="number"
      min="0" max="5" step="0.5"
      class="form-control"
      :required="property.required"
    />

    <input
      v-else-if="property.type == 'date'"
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
      type="date"
      class="form-control"
      :required="property.required"
    />

    <input
      v-else-if="property.type == 'color'"
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
      type="color"
      class="form-control"
      :required="property.required"
    />

    <YesNo
      v-else-if="property.type == 'yesno'"
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
    />

    <MediaSelector
      v-else-if="property.type == 'image' || property.type == 'video'"
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
      :type="property.type"
      :mandatory="property.required"
    />

    <div v-else-if="property.type == 'url'" class="input-group">
      <input
        :name="'c' + $parent.collection.id + '-' + name"
        v-model="value"
        type="text"
        class="form-control"
        :placeholder="$t('URL example')"
        :required="property.required"
      />
      <a v-if="value" :href="value" class="btn btn-secondary" :title="$t('Open in new tab')" target="_blank">
        <i class="bi bi-box-arrow-up-right"></i>
      </a>
    </div>

    <input
      v-else
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
      :type="property.type"
      class="form-control"
      :required="property.required"
    />

    <span v-if="property.suffix" class="input-group-text">
      {{ property.suffix }}
    </span>
  </div>
</template>

<script>
import MediaSelector from "./MediaSelector.vue"
import YesNo from "./YesNo.vue"

export default {
  components: {
    MediaSelector,
    YesNo,
  },
  props: {
    name: {
      required: true,
    },
    property: {
      required: true,
    },
    modelValue: {},
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit("update:modelValue", value)
      },
    },
  },
}
</script>
