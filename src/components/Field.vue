<template>
  <div v-if="name && value" :class="'field field-'+name">
    <div v-if="type && type.showLabel" class="field-label">
      <Translation v-if="type.label && Object.keys(type.label).length > 0" :text=type.label />
      <template v-else>{{name}}</template>:
    </div>
    <div class="field-value">
      <h1 v-if="type && type.isTitle">{{value}}</h1>
      <h2 v-else-if="type && type.isSubTitle">{{value}}</h2>
      <Image v-else-if="type && type.type == 'image'" :url="value" />
      <Video v-else-if="type && type.type == 'video'" :url="value" />
      <Url v-else-if="type && type.type == 'url'" :url="value" />
      <YesNo v-else-if="type && type.type == 'yesno'" :label="name" :value=value />
      <Rating v-else-if="type && type.type == 'rating'" :label="name" :value=value />
      <template v-else>
        <ul v-if="Array.isArray(value)">
          <li class="value" v-for="val in value" :key="val">{{val}}
            <span v-if="type && type.suffix" class="field-suffix">
              {{type.suffix}}
            </span>
          </li>
        </ul>
        <template v-else>
          <span class="value">{{value}}</span>
          <span v-if="type && type.suffix" class="field-suffix">
            {{type.suffix}}
          </span>
        </template>
      </template>
    </div>
    <span v-if="type && type.filterable" class="field-filter">
      <a :href="'/collection/'+this.$parent.collection.id+'/?filterBy='+name+'&filterValue='+value" title="Filter items"><i class="bi-funnel-fill"></i></a>
    </span>
  </div>
</template>

<script>
import Image from './fields/medias/Image.vue'
import Rating from './fields/Rating.vue'
import Translation from './fields/Translation.vue'
import Url from './fields/Url.vue'
import Video from './fields/medias/Video.vue'
import YesNo from './fields/YesNo.vue'

export default {
  components: {
    Image,
    Rating,
    Translation,
    Url,
    Video,
    YesNo,
  },
  props: {
    name: {
      required: true
    },
    value: {},
  },
  computed: {
    type() {
      return this.$parent.collection.fields[this.name]
    }
  }
}
</script>
