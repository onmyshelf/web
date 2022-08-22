<template>
  <Error v-if="errors.length > 0" />
  <div v-else class="container-fluid">
    <button class="navbar-toggler" type="button" @click="toggleSidebar()">
      <i class="bi bi-list" style="font-size: 2em"></i>
    </button>
    <div class="row">
      <div id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div class="position-sticky pt-3">
          <h4>{{ $t("Display mode") }}</h4>
          <div>
            <select v-model="displayMode" @change="toggleDisplay()" class="form-select">
              <option value="shop">Shop</option>
              <option value="list">List</option>
              <option value="mosaic">Mosaic</option>
            </select>
          </div>
          <div class="position-sticky pt-3">
            <h4>{{ $t("Search") }}</h4>
            <input v-model="search" type="text" class="form-control" :placeholder="$t('Search item')" />
          </div>
          <div v-if="filters.length > 0 && Object.keys(collection.properties).length > 0" class="position-sticky pt-3">
            <h4>Filters</h4>
            <p v-for="filter in filters" :key="filter">
              <i class="bi-filter-square"></i>&nbsp;
              <PropertyLabel :name="filter.name" :property=collection.properties[filter.name] />
              {{ filter.value }}&nbsp;
              <a :href="reloadCollection(filters.filter(f => f.name != filter.name),sorting)" title="Clear filter"><i class="bi bi-x-circle"></i></a>
            </p>
          </div>
          <div v-if="collection && Object.keys(collection.properties).length > 0" class="position-sticky pt-3">
            <h4>{{ $t("Sort by") }}</h4>
            <template v-for="(property, name) of collection.properties" :key="name">
              <template v-if="property.isTitle || property.sortable">
                <PropertyLabel :name="name" :property="property" />
                <i v-if="sorting == name" class="bi bi-arrow-down-circle-fill"></i>
                <a v-else :href="reloadCollection(filters,name)"><i class="bi bi-arrow-down-circle"></i></a>&nbsp;
                <i v-if="sorting == '-'+name" class="bi bi-arrow-up-circle-fill"></i>
                <a v-else :href="reloadCollection(filters,'-'+name)"><i class="bi bi-arrow-up-circle"></i></a>
                <br />
              </template>
            </template>
            <div class="position-sticky pt-3">
              <h4>{{ $t("Filter by") }}</h4>
              <template v-for="(property, name) of collection.properties" :key="name">
                <template v-if="property.filterable">
                  <PropertyLabel :name="name" :property=collection.properties[name] />
                  <select :id="'filter-' + name" @change="filterBy(name)" class="form-select">
                    <option value=""></option>
                    <template v-for="filter in property.values" :key="filter">
                      <option :value="filter">{{ filter }}</option>
                    </template>
                  </select>
                </template>
              </template>
            </div>
          </div>
        </div><!-- .position-sticky -->
      </div><!-- sidebar -->

      <Loading v-if="loading"/>
      <div v-else class="collection col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <Breadcrumbs v-if="collection.name" :current="title" />
        <h1>{{ title }}</h1>
        <p v-if="collection.description">{{ collection.description }}</p>
        <p v-if="items">{{ $t("Items") }}: {{ items.length }}</p>

        <p v-if="isMine" style="text-align: right">
          <router-link v-if="collection && Object.keys(collection.properties).length > 0"
            to="item/new" class="btn btn-outline-success">
            <i class="bi bi-plus-lg"></i> {{ $t("Create an item") }}
          </router-link>&nbsp;
          <router-link v-if="collection"
            to="import/item" class="btn btn-outline-primary">
            <i class="bi bi-box-arrow-in-down-left"></i> {{ $t("Import") }}
          </router-link>&nbsp;
          <router-link to="manage/" class="btn btn-outline-secondary">
            <i class="bi-gear-fill"></i> {{ $t("Manage") }}
          </router-link>
        </p>

        <div v-if="items" :class="'container items items-'+displayMode">
          <template v-if="items.length == 0">
            <Empty v-if="isMine" label="No items. Create your first item or import them!" />
            <Empty v-else label="No items" />
          </template>
          <template v-else>
            <template v-if="this.displayMode == 'mosaic'">
              <PreviewMosaic v-for="item of items" :key="item.id" :item="item" />
            </template>
            <template v-else-if="this.displayMode == 'shop'">
              <div class="row">
                <PreviewShop v-for="item of items" :key="item.id" :item="item" />
              </div>
            </template>
            <template v-else>
              <PreviewList v-for="item of items" :key="item.id" :item="item" />
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewList from "./items/PreviewList.vue"
import PreviewMosaic from "./items/PreviewMosaic.vue"
import PreviewShop from "./items/PreviewShop.vue"
import PropertyLabel from "./PropertyLabel.vue"
import Breadcrumbs from "@/components/Breadcrumbs.vue"
import Empty from "@/components/Empty.vue"
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"

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
        coverProperty: null,
        visibility: null,
      },
      items: null,
      displayMode: "shop",
      errors: [],
      filters: [],
      sorting: null,
      search: "",
      loading: true,
    }
  },
  created() {
    // get display mode
    if (localStorage.getItem("onmyshelf_displayMode")) {
      this.displayMode = localStorage.getItem("onmyshelf_displayMode")
    }

    // prepare API query parameters
    let options = { params: {} }

    // get filters
    const filters = Object.keys(this.$route.query).filter((k) => k.substring(0,2) == "p_")
    filters.forEach((prop) => {
      options.params[prop] = this.$route.query[prop]
      this.filters.push({
        name: prop.substring(2),
        value: decodeURIComponent(this.$route.query[prop]),
      })
    });

    // get sorting
    if (this.$route.query.sort) {
      options.params.sort = this.$route.query.sort
      this.sorting = this.$route.query.sort
    }

    // get collection details
    this.$apiGet("collections/" + this.collection.id)
      .then((response) => {
        // translate name & description
        if (response.data.name) {
          this.collection.name = this.$translate(response.data.name)
        } else {
          this.collection.name = "Collection " + this.collection.id
        }
        if (response.data.description) {
          this.collection.description = this.$translate(response.data.description)
        }

        // other properties
        this.collection.cover = response.data.cover
        this.collection.thumbnail = response.data.thumbnail
        this.collection.owner = response.data.owner
        this.collection.properties = response.data.properties
        this.collection.visibility = response.data.visibility

        // search title property
        if (response.data.properties) {
          for (let key in response.data.properties) {
            if (response.data.properties[key].isTitle) {
              this.collection.titleProperty = key
              // default sorting (if not specified)
              if (!this.sorting) {
                this.sorting = key
              }
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
      .catch((e) => {
        this.errors.push(e)
      })

    // get items
    this.$apiGet("collections/" + this.collection.id + "/items", options)
      .then((response) => {
        this.items = response.data
        this.loading = false
      })
      .catch((e) => {
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
        return "Collection " + this.collection.id
      }
    },
  },
  methods: {
    reloadCollection(filters, sorting) {
      var query = []
      filters.forEach((filter) => {
        query.push("p_" + filter.name + "=" + encodeURIComponent(filter.value))
      })
      if (sorting) {
        query.push("sort=" + sorting)
      }

      return "?" + query.join("&")
    },
    toggleDisplay() {
      localStorage.setItem("onmyshelf_displayMode", this.displayMode)
    },
    filterBy(name) {
      document.location = "./?p_" + name + "=" + document.getElementById("filter-" + name).value
    },
    toggleSidebar() {
      let sidebar = document.getElementById("sidebarMenu")

      if (sidebar.style.display == "block") {
        sidebar.style.display = "none"
      } else {
        sidebar.style.display = "block"
      }
    },
  },
}
</script>
