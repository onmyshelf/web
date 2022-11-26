<template>
  <div class="property-value">
    <Image v-if="property.type == 'image'" :url="value" />
    <Video v-else-if="property.type == 'video'" :url="value" />
    <YesNo v-else-if="property.type == 'yesno'" :label="name" :value="value" />
    <Rating v-else-if="property.type == 'rating'" :label="name" :value="value" />
    <Json v-else-if="property.type == 'json'" :obj="jsonDecode(value)" />
    <a v-else-if="property.type == 'url'" :href="value">
      Open link &nbsp;<i class="bi bi-box-arrow-up-right"></i>
    </a>
    <Color v-else-if="property.type == 'color'" :value="value" />
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
import Color from "./properties/Color.vue"
import Image from "./properties/medias/Image.vue"
import Json from "./properties/Json.vue"
import Rating from "./properties/Rating.vue"
import Video from "./properties/medias/Video.vue"
import YesNo from "./properties/YesNo.vue"

export default {
  components: {
    Color,
    Image,
    Json,
    Rating,
    Video,
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
