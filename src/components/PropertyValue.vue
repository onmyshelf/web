<template>
  <div class="property-value">
    <ImageView v-if="property.type == 'image'" :url="value" />
    <VideoPlayer v-else-if="property.type == 'video'" :url="value" />
    <YesNo v-else-if="property.type == 'yesno'" :label="name" :value="value" />
    <RatingView v-else-if="property.type == 'rating'" :label="name" :value="value" />
    <JsonView v-else-if="property.type == 'json'" :obj="jsonDecode(value)" />
    <a v-else-if="property.type == 'url'" :href="value">
      {{ $t("Open link") }} &nbsp;<i class="bi bi-box-arrow-up-right"></i>
    </a>
    <ColorView v-else-if="property.type == 'color'" :value="value" />
    <template v-else>
      <ul v-if="Array.isArray(value)">
        <li class="value" v-for="val in value" :key="val">{{ val }}
          <span v-if="property.suffix" class="property-suffix">
            {{ property.suffix }}
          </span>
        </li>
      </ul>
      <template v-else>
        <span class="value">{{ value }}</span>
        <span v-if="property.suffix" class="property-suffix">
          {{ property.suffix }}
        </span>
      </template>
    </template>
    <span v-if="property.filterable" class="property-filter">
      <a :href="'/collection/' + this.$parent.collection.id + '/?p_' + name + '=' + encodeURIComponent(value)"
        :title="$t('Filter by') + ' ' + value" force
      >
        <i class="bi-filter-square-fill"></i>
      </a>
    </span>
  </div>
</template>

<style scoped>
.property-value {
  display: inline-block;
  margin-right: 0.5em;
}

.property-filter {
  margin-left: 0.5em;
}
</style>

<script>
import ColorView from "./properties/ColorView.vue"
import ImageView from "./properties/ImageView.vue"
import JsonView from "./properties/JsonView.vue"
import RatingView from "./properties/RatingView.vue"
import VideoPlayer from "./properties/video/VideoPlayer.vue"
import YesNo from "./properties/YesNo.vue"

export default {
  components: {
    ColorView,
    ImageView,
    JsonView,
    RatingView,
    VideoPlayer,
    YesNo,
  },
  props: {
    name: {
      required: true,
    },
    property: {},
    value: {},
  },
  methods: {
    jsonDecode(text) {
      try {
        return JSON.parse(text)
      } catch (e) {
        console.warn("Failed to decode JSON for item property: " + this.name)
      }
    },
  },
}
</script>
