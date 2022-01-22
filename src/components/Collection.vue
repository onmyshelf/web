<template>
  <Error v-if="errors.length > 0" />
  <div v-else class="container-fluid">
    <div class="row">
      <div id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div class="position-sticky pt-3">
          <h4>Display options</h4>
          <p>
            Display mode:
            <select v-model="displayMode" @change="toggleDisplay()" class="form-select">
              <option value="shop">Shop</option>
              <option value="list">List</option>
              <option value="mosaic">Mosaic</option>
            </select>
          </p>
          <div v-if="filters.length > 0" class="mb-3">
            <h4>Filters</h4>
            <ul>
              <li v-for="filter in filters" :key=filter>
                <PropertyLabel :name=filter.name :property=collection.properties[filter.name] />{{filter.value}}&nbsp;
                <a href="." title="Clear filter"><i class="bi bi-x-circle"></i></a>
              </li>
            </ul>
          </div>
          <div v-if="collection && Object.keys(collection.properties).length > 0" class="mb-3">
            <h4>Sort by</h4>
            <ul>
              <template v-for="(property, name) of collection.properties" :key=name>
                <li v-if="property.sortable">
                  <PropertyLabel :name=name :property=property />
                  <a :href="'?sort='+name"><i class="bi bi-arrow-down-circle"></i></a>&nbsp;
                  <a :href="'?sort=-'+name"><i class="bi bi-arrow-up-circle"></i></a>
                </li>
              </template>
            </ul>
          </div>
        </div><!-- .position-sticky -->
      </div><!-- sidebar -->

      <Loading v-if="loading"/>
      <div v-else class="collection col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <Breadcrumbs v-if="collection.name" :current="title"/>
        <h1>{{title}}</h1>
        <p v-if="collection.description">{{collection.description}}</p>
        <p v-if="items">Items: {{items.length}}</p>

        <p v-if="isMine" style="text-align:right">
          <router-link to="manage/" class="btn btn-outline-primary">
            <i class="bi-gear-fill"></i> Manage
          </router-link>&nbsp;
          <router-link v-if="collection && Object.keys(collection.properties).length > 0"
            to="item/new" class="btn btn-outline-success">
            Create item
          </router-link>
        </p>

        <div v-if="items" :class="'container items items-'+displayMode">
          <template v-if="items.length == 0">
            <Empty v-if="isMine" label="No items. Create your first item or import them!" />
            <Empty v-else label="No items" />
          </template>
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
import PropertyLabel from './PropertyLabel.vue'
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
    PropertyLabel,
  },
  data() {
    return {
      collection: {
        id: this.$route.params.cid,
        name: null,
        description: null,
        cover: null,
        owner: null,
        properties: [],
        titleProperty: null,
        coverProperty: null
      },
      items: null,
      displayMode: 'shop',
      errors: [],
      filters: [],
      sorting: null,
      loading: true
    }
  },
  created() {
    // get display mode
    if (localStorage.getItem('onmyshelf_displayMode')) {
      this.displayMode = localStorage.getItem('onmyshelf_displayMode')
    }

    // prepare API query parameters
    var apiQuery = []

    // get filters
    const filters = Object.keys(this.$route.query).filter(k => k.substring(0,2) == 'p_')
    filters.forEach(prop => {
      console.log(prop)
      apiQuery.push(prop+'='+this.$route.query[prop])
      this.filters.push({
        name: prop.substring(2),
        value: this.$route.query[prop]
      })
    });

    // get sorting
    if (this.$route.query.sort) {
      apiQuery = ['sort='+this.$route.query.sort]
      this.sorting = this.$route.query.sort
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
      this.collection.properties = response.data.properties

      // search title property
      if (response.data.properties) {
        for (let key in response.data.properties) {
          if (response.data.properties[key].isTitle) {
            this.collection.titleProperty = key
          }
          if (response.data.properties[key].isSubTitle) {
            this.collection.subTitleProperty = key
          }
          if (response.data.properties[key].isCover) {
            this.collection.coverProperty = key
          }
        }
      }
    })
    .catch(e => {
      this.errors.push(e)
    })

    // get items
    axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.collection.id + '/items?' + apiQuery.join('&'), this.$apiConfig())
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
  },
  methods: {
    toggleDisplay() {
      localStorage.setItem('onmyshelf_displayMode', this.displayMode)
    }
  }
}
</script>
