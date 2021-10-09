<template>
  <div class="container">
    <Error v-if="errors.length > 0" />
    <template v-else>
      <Breadcrumbs v-if="collection && item" :parents=breadcrumbs :current=title />
      <div v-if="item && collection && collection.properties" class="row item">
        <div class="col-4 item-cover">
          <Image v-if="item.properties && coverProperty && item.properties[coverProperty]" :url="item.properties[coverProperty]"
            :cover=true :linked=true />
          <Image v-else :url="collection.cover" :cover=true />

          <div v-if="gallery.length > 0" class="gallery">
            <template v-for="property in gallery" :key="property">
              <Image v-if="item.properties[property] && !collection.properties[property].isCover" :url="item.properties[property]" :linked=true />
            </template>
          </div>
        </div>
        <div class="col">
          <h1>{{title}}</h1>
          <h2 v-if="subTitleProperty && item.properties[subTitleProperty]">{{item.properties[subTitleProperty]}}</h2>
          <template v-if="item.properties">
            <template v-for="(property, name) of collection.properties" :key="name">
              <div v-if="!property.shown && (item.properties[name] || property.default)" class="item-preview">
                <Property :name="name" :property=property :value=item.properties[name] />
              </div>
            </template>
          </template>
          <a v-if="isMine" href="edit" class="btn btn-outline-primary">
            <i class="bi-pencil"></i> Edit
          </a>
        </div><!-- .col -->
      </div><!-- .row -->
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import Image from './properties/medias/Image.vue'
import Error from '@/components/Error.vue'
import Property from '@/components/Property.vue'

export default {
  components: {
    Breadcrumbs,
    Image,
    Error,
    Property
  },
  data() {
    return {
      breadcrumbs: [
        {
          url: '/collection/' + this.$route.params.cid + '/',
          label: 'Collection ' + this.$route.params.cid
        }
      ],
      collection: null,
      item: null,
      errors: [],
      titleProperty: null,
      subTitleProperty: null,
      coverProperty: null,
      gallery: []
    }
  },
  created() {
    // get collection
    axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.$route.params.cid, this.$apiConfig())
    .then(response => {

      this.collection = response.data

      // translate name
      if (response.data.name) {
        this.collection.name = this.$translate(response.data.name)
      } else {
        this.collection.name = 'Collection ' + this.$route.params.cid
      }
      this.breadcrumbs[0].label = this.collection.name

      // parse properties
      if (response.data.properties) {
        for (let key in response.data.properties) {
          // search title property
          if (response.data.properties[key].isTitle) {
            this.titleProperty = key
            this.collection.properties[key].shown = true
          }
          // search subtitle property
          if (response.data.properties[key].isSubTitle) {
            this.subTitleProperty = key
            this.collection.properties[key].shown = true
          }
          // search cover property
          if (response.data.properties[key].isCover) {
            this.coverProperty = key
            this.collection.properties[key].shown = true
          }
          // search images for gallery
          if (response.data.properties[key].type == 'image') {
            this.gallery.push(key)
            this.collection.properties[key].shown = true
          }
        }
      }
    })
    .catch(e => {
      this.errors.push(e)
    })

    // get item
    axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.$route.params.cid + '/items/' + this.$route.params.id, this.$apiConfig())
    .then(response => {
      this.item = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  computed: {
    // check if collection is mine
    isMine() {
      return this.$matchUserId(this.collection.owner)
    },
    title() {
      if (this.item.properties[this.titleProperty]) {
        return this.item.properties[this.titleProperty]
      } else {
        return 'Item '+this.item.id
      }
    }
  }
}
</script>
