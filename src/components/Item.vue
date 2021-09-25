<template>
  <div class="container">
    <Error v-if="errors.length > 0" />
    <template v-else>
      <Breadcrumbs v-if="collection && item" :parents=breadcrumbs :current=title />
      <div v-if="item && collection && collection.fields" class="row item">
        <div class="col-4 item-cover">
          <Image v-if="item.fields && coverField && item.fields[coverField]" :url="item.fields[coverField]"
            :cover=true :linked=true />
          <Image v-else :url="collection.cover" :cover=true />

          <div v-if="gallery.length > 0" class="gallery">
            <template v-for="field in gallery" :key="field">
              <Image v-if="item.fields[field] && !collection.fields[field].isCover" :url="item.fields[field]" :linked=true />
            </template>
          </div>
        </div>
        <div class="col">
          <h1>{{title}}</h1>
          <a v-if="isMine" href="edit" class="btn btn-outline-primary">
            <i class="bi-pencil"></i> Edit
          </a>
          <template v-if="item.fields">
            <template v-for="(field, name) of collection.fields" :key="name">
              <div v-if="!field.shown && (item.fields[name] || field.default)" class="item-preview">
                <Field :name="name" :field=field :value=item.fields[name] />
              </div>
            </template>
          </template>
        </div><!-- .col -->
      </div><!-- .row -->
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import Image from './fields/medias/Image.vue'
import Error from '@/components/Error.vue'
import Field from '@/components/Field.vue'

export default {
  components: {
    Breadcrumbs,
    Image,
    Error,
    Field
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
      titleField: null,
      coverField: null,
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

      // parse fields
      if (response.data.fields) {
        for (let key in response.data.fields) {
          // search title field
          if (response.data.fields[key].isTitle) {
            this.titleField = key
            this.collection.fields[key].shown = true
          }
          // search cover field
          if (response.data.fields[key].isCover) {
            this.coverField = key
            this.collection.fields[key].shown = true
          }
          // search images for gallery
          if (response.data.fields[key].type == 'image') {
            this.gallery.push(key)
            this.collection.fields[key].shown = true
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
      if (this.item.fields[this.titleField]) {
        return this.item.fields[this.titleField]
      } else {
        return 'Item '+this.item.id
      }
    }
  }
}
</script>
