<template>
  <div class="mb-1">
    <textarea
      v-if="property.type == 'longtext'"
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
      rows="4"
      class="form-control"
      :required="property.required"
    />

    <textarea
      v-else-if="property.type == 'json'"
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
      rows="6"
      class="form-control"
      placeholder="{...}"
      :required="property.required"
    />

    <input
      v-else-if="property.type == 'rating'"
      :name="'c' + $parent.collection.id + '-' + name"
      v-model="value"
      type="number"
      min="0"
      max="5"
      step="0.5"
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
      v-else-if="property.type == 'file' || property.type == 'image' || property.type == 'video'"
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
      <a
        v-if="value"
        :href="value"
        class="btn btn-secondary"
        :title="$t('Open in new tab')"
        target="_blank"
      >
        <i class="bi bi-box-arrow-up-right" />
      </a>
    </div>

    <div v-else>
      <input
        v-model="value"
        :type="property.type"
        class="form-control dropdown-toggle"
        :required="property.required"
        autocomplete="false"
        @keyup="getValues(value)"
      />
      <ul v-if="values.length > 0" class="dropdown-menu" style="display: block">
        <li v-for="v in values" :key="v">
          <a class="dropdown-item" @click="chooseValue(v)">
            {{ v }}
          </a>
        </li>
        <li>
          <a class="dropdown-item text-danger" @click="values = []">
            {{ $t("Cancel") }}
          </a>
        </li>
      </ul>
    </div>
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
  data() {
    return {
      search: "",
      values: [],
    }
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
  methods: {
    getValues(value) {
      if (this.$demoMode()) {
        return
      }
      if (!value || value.length < 3) {
        return
      }
      if (value == this.search) {
        return
      }

      this.search = value

      this.$apiPost("collections/" + this.$route.params.cid + "/properties/" + this.name + "/values", {search: value})
      .then((response) => {
        this.values = response.data
      })
    },
    chooseValue(value) {
      this.value = value
      this.values = []
    }
  },
}
</script>
