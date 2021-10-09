<template>
  <Error v-if="errors.length > 0" />
  <div v-else class="container-fluid">
    <div class="row">
      <div id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div class="position-sticky pt-3">
          <h4>Display options</h4>
          <p>
            Display as:
            <select v-model="displayMode" class="form-select">
              <option value="shop">Shop</option>
              <option value="list">List</option>
              <option value="mosaic">Mosaic</option>
            </select>
          </p>
          <div v-if="filters.length > 0" class="mb-3">
            <h4>Filters</h4>
            <ul>
              <li v-for="filter in filters" :key=filter>{{filter.field}}={{filter.value}}</li>
            </ul>
            <a :href="'/collection/'+collection.id+'/'">Clear filters</a>
          </div>
          <div v-if="isMine">
            <h4>Manage collection</h4>
            <a href="manage/" class="btn btn-outline-primary">Manage</a>
            <a v-if="collection && collection.fields && collection.fields > 0" href="item/new" class="btn btn-outline-success">Create item</a>
          </div>
        </div><!-- .position-sticky -->
      </div><!-- sidebar -->

      <Loading v-if="loading"/>
      <div v-else class="collection col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <Breadcrumbs v-if="collection.name" :current="title"/>
        <h1>{{title}}</h1>
        <p v-if="collection.description">{{collection.description}}</p>
        <p v-if="items">Items: {{items.length}}</p>

        <div v-if="items" :class="'container items items-'+displayMode">
          <Empty v-if="items.length == 0" label="No items" />
          <template v-else>
            <template v-if="this.displayMode == 'mosaic'">
              <PreviewMosaic v-for="item of items" :key="item.id" :item=item />
            </template>
            <template v-else-if="this.displayMode == 'shop'">
              <div class="row">
                <PreviewShop v-for="item of items" :key="item.id" :item=item />
              </div>
            </template>
            <template v-else>
              <PreviewList v-for="item of items" :key="item.id" :item=item />
            </template>
          </template>
        </div><!-- .container .items -->
      </div><!-- .collection -->
    </div><!-- .row -->
  </div><!-- .container-fluid -->
</template>

<script>
import axios from 'axios'
import PreviewList from './items/PreviewList.vue'
import PreviewMosaic from './items/PreviewMosaic.vue'
import PreviewShop from './items/PreviewShop.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import Empty from '@/components/Empty.vue'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'

export default {
  components: {
    Breadcrumbs,
    Empty,
    Error,
    Loading,
    PreviewList,
    PreviewMosaic,
    PreviewShop,
  },
  data() {
    return {
      collection: {
        id: this.$route.params.cid,
        name: null,
        description: null,
        cover: null,
        owner: null,
        fields: [],
        titleField: null,
        coverField: null
      },
      items: null,
      displayMode: 'shop',
      errors: [],
      filters: [],
      loading: true
    }
  },
  created() {
    // get URL parameters
    var query = []
    if (this.$route.query.filterBy) {
      query = ['filterBy='+this.$route.query.filterBy, 'filterValue='+this.$route.query.filterValue]
      this.filters.push({
        field: this.$route.query.filterBy,
        value: this.$route.query.filterValue
      })
    }

    // get collection details
    axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.collection.id, this.$apiConfig())
    .then(response => {
      // translate name & description
      if (response.data.name) {
        this.collection.name = this.$translate(response.data.name)
      } else {
        this.collection.name = 'Collection ' + this.collection.id
      }
      if (response.data.description) {
        this.collection.description = this.$translate(response.data.description)
      }

      // other properties
      this.collection.cover = response.data.cover
      this.collection.owner = response.data.owner
      this.collection.fields = response.data.fields

      // search title field
      if (response.data.fields) {
        for (let key in response.data.fields) {
          if (response.data.fields[key].isTitle) {
            this.collection.titleField = key
          }
          if (response.data.fields[key].isSubTitle) {
            this.collection.subTitleField = key
          }
          if (response.data.fields[key].isCover) {
            this.collection.coverField = key
          }
        }
      }
    })
    .catch(e => {
      this.errors.push(e)
    })

    // get items
    axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.collection.id + '/items?' + query.join('&'), this.$apiConfig())
    .then(response => {
      this.items = response.data
      this.loading = false
    })
    .catch(e => {
      this.errors.push(e)
      this.loading = false
    })
  },
  computed: {
    // check if collection is mine
    isMine() {
      return this.$matchUserId(this.collection.owner)
    },
    title() {
      if (this.collection.name) {
        return this.collection.name
      } else {
        return 'Collection ' + this.collection.id
      }
    }
  }
}
</script>
