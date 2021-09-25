<template>
  <div class="field-value">
    <Image v-if="field.type == 'image'" :url="value" />
    <Video v-else-if="field.type == 'video'" :url="value" />
    <Url v-else-if="field.type == 'url'" :url="value" />
    <YesNo v-else-if="field.type == 'yesno'" :label="name" :value=value />
    <Rating v-else-if="field.type == 'rating'" :label="name" :value=value />
    <Json v-else-if="field.type == 'json'" :obj=jsonDecode(value) />
    <template v-else>
      <ul v-if="Array.isArray(value)">
        <li class="value" v-for="val in value" :key="val">{{val}}
          <span v-if="field.suffix" class="field-suffix">{{field.suffix}}</span>
        </li>
      </ul>
      <template v-else>
        <span class="value">{{value}}</span>
        <span v-if="field.suffix" class="field-suffix">{{field.suffix}}</span>
      </template>
    </template>
    <span v-if="field.filterable" class="field-filter">
      <a :href="'/collection/'+this.$parent.collection.id+'/?filterBy='+name+'&filterValue='+value" title="Filter items">
        <i class="bi-funnel-fill"></i>
      </a>
    </span>
  </div>
</template>

<script>
import Image from './fields/medias/Image.vue'
import Json from './fields/Json.vue'
import Rating from './fields/Rating.vue'
import Url from './fields/Url.vue'
import Video from './fields/medias/Video.vue'
import YesNo from './fields/YesNo.vue'

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
    field: {},
    value: {},
  },
  methods: {
    jsonDecode(text) {
      try {
        return JSON.parse(text)
      } catch(e) {
        console.warn("Failed to decode JSON for item field: " + this.name)
      }
    }
  }
}
</script>
