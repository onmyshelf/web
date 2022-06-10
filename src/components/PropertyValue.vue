<template>
  <div class="property-value">
    <Image v-if="property.type == 'image'" :url="value" />
    <Video v-else-if="property.type == 'video'" :url="value" />
    <Url v-else-if="property.type == 'url'" :url="value" />
    <YesNo v-else-if="property.type == 'yesno'" :label="name" :value=value />
    <Rating v-else-if="property.type == 'rating'" :label="name" :value=value />
    <Json v-else-if="property.type == 'json'" :obj=jsonDecode(value) />
    <template v-else>
      <ul v-if="Array.isArray(value)">
        <li class="value" v-for="val in value" :key="val">{{val}}
          <span v-if="property.suffix" class="property-suffix">{{property.suffix}}</span>
        </li>
      </ul>
      <template v-else>
        <span class="value">{{value}}</span>
        <span v-if="property.suffix" class="property-suffix">{{property.suffix}}</span>
      </template>
    </template>
    <span v-if="property.filterable" class="property-filter">
      <a :href="'/collection/'+this.$parent.collection.id+'/?p_'+name+'='+encodeURIComponent(value)"
        :title="'Filter by '+value" force>
        <i class="bi-funnel-fill"></i>
      </a>
    </span>
  </div>
</template>

<script>
import Image from './properties/medias/Image.vue'
import Json from './properties/Json.vue'
import Rating from './properties/Rating.vue'
import Url from './properties/Url.vue'
import Video from './properties/medias/Video.vue'
import YesNo from './properties/YesNo.vue'

export default {
  components: {
    Image,
    Json,
    Rating,
    Url,
    Video,
    YesNo,
  },
  props: {
    name: {
      required: true
    },
    property: {},
    value: {},
  },
  methods: {
    jsonDecode(text) {
      try {
        return JSON.parse(text)
      } catch(e) {
        console.warn("Failed to decode JSON for item property: " + this.name)
      }
    }
  }
}
</script>
