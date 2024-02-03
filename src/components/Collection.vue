<template>
  <Error v-if="error" :status="error" />
  <div v-else class="container-fluid">
    <button class="navbar-toggler" type="button" @click="toggleSidebar()">
      <i class="bi bi-list" style="font-size: 2em"></i>
    </button>
    <div class="row">
      <div id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div class="position-sticky pt-3">
          <h4>{{ $t("Display mode") }}</h4>
          <div class="btn-group" role="group" aria-label="Toggle display mode">
            <input
              type="radio"
              class="btn-check"
              id="displaymode-shop"
              autocomplete="off"
              @change="toggleDisplay('shop')"
              :checked="displayMode == 'shop'"
            />
            <label class="btn btn-outline-secondary" for="displaymode-shop">
              <i class="bi bi-grid" :title="$t('Shop style')"></i>
            </label>

            <input
              type="radio"
              class="btn-check"
              id="displaymode-list"
              autocomplete="off"
              @change="toggleDisplay('list')"
              :checked="displayMode == 'list'"
            />
            <label class="btn btn-outline-secondary" for="displaymode-list">
              <i class="bi bi-list" :title="$t('List')"></i>
            </label>

            <input
              type="radio"
              class="btn-check"
              id="displaymode-mosaic"
              autocomplete="off"
              @change="toggleDisplay('mosaic')"
              :checked="displayMode == 'mosaic'"
            />
            <label class="btn btn-outline-secondary" for="displaymode-mosaic">
              <i class="bi bi-grid-3x3" :title="$t('Mosaic')"></i>
            </label>
          </div>
          <!-- end of select display mode -->

          <div class="position-sticky pt-3">
            <h4>{{ $t("Search") }}</h4>
            <input v-model="search" type="text" class="form-control" :placeholder="$t('Search item')" />
          </div>

          <div v-if="collection && Object.keys(collection.properties).length > 0" class="position-sticky pt-3">
            <h4>{{ $t("Sort by") }}</h4>
            <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
              <select @change="sortBy($event.target.value)" class="form-select">
                <template v-for="(property, name) of collection.properties" :key="name">
                  <option v-if="property.isTitle || property.sortable" :value="name" :selected="sorting == name || sorting == '-' + name">
                    {{ $translate(property.label) ? $translate(property.label) : name }}
                  </option>
                </template>
                <option value="created" :selected="sorting.match(/^-*created$/)">
                  {{ $t('Creation date') }}
                </option>
              </select>
              <button type="button" :class="'btn ' + (sorting.substring(0, 1) != '-' ? 'btn-secondary' : 'btn-outline-secondary')">
                <a :href="sorting.substring(0, 1) == '-' ? reloadUrl(filters, sorting.substring(1)) : '#'">
                  <i class="bi bi-sort-down-alt"></i>
                </a>
              </button>
              <button type="button" :class="'btn ' + (sorting.substring(0, 1) == '-' ? 'btn-secondary' : 'btn-outline-secondary')">
                <a :href="sorting.substring(0, 1) != '-' ? reloadUrl(filters, '-' + sorting) : '#'">
                  <i class="bi bi-sort-up"></i>
                </a>
              </button>
            </div>
            <!-- end of select sorting -->

            <div class="position-sticky pt-3">
              <h4>{{ $t("Filter by") }}</h4>
              <template v-for="(property, filterName) of collection.properties" :key="filterName">
                <div v-if="property.filterable" class="filter">
                  <PropertyLabel :name="filterName" :property=collection.properties[filterName] />
                  <a
                    v-if="getFilter(filterName)"
                    :href="reloadUrl(filters.filter(f => f.name != filterName), sorting)"
                    title="Clear filter"
                  >
                    <i class="bi bi-x-circle"></i>
                  </a>
                  <div class="filter-value">
                    <select
                      v-if="collection.properties[filterName].type == 'rating'"
                      @change="filterBy(filterName, '>' + $event.target.value)"
                      class="form-select"
                    >
                      <option v-if="!getFilter(filterName)" value=""></option>
                      <template v-for="filter in property.values" :key="filter">
                        <option :value="filter" :selected="getFilter(filterName) && getFilter(filterName).value == '>' + filter">{{ filter }}+</option>
                      </template>
                    </select>
                    <template v-else-if="collection.properties[filterName].type == 'yesno'">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        @change="filterBy(filterName, true)"
                        :checked="getFilter(filterName) && getFilter(filterName).value == 'true'"
                      />&nbsp;{{ $t("Yes") }}<br />
                      <input
                        type="checkbox"
                        class="form-check-input"
                        @change="filterBy(filterName, false)"
                        :checked="getFilter(filterName) && getFilter(filterName).value == 'false'"
                      />&nbsp;{{ $t("No") }}
                    </template>
                    <select
                      v-else
                      @change="filterBy(filterName, $event.target.value)"
                      class="form-select"
                    >
                      <option v-if="!getFilter(filterName)" value=""></option>
                      <template v-for="filter in property.values" :key="filter">
                        <option
                          :value="filter"
                          :selected="getFilter(filterName) && getFilter(filterName).value == filter"
                        >
                          {{ filter }}
                        </option>
                      </template>
                    </select>
                  </div>
                </div>
              </template>
            </div>
            <!-- end of filters -->
          </div>

          <div class="position-sticky pt-3">
            <h4>{{ $t("Items per page") }}</h4>
            <select
              @change="changeItemsPerPage($event.target.value)"
              class="form-select"
            >
              <option
                v-for="i in ([20, 100, 200])" :key="i"
                :value="i"
                :selected="itemsPerPage == i"
              >
                {{ i }}
              </option>
              <option value="0" :selected="itemsPerPage == 0">{{ $t("Unlimited") }}</option>
            </select>
          </div>
          <!-- end of select nb of items/page -->
        </div>
        <!-- end of position-sticky -->
      </div>
      <!-- end of sidebar -->

      <Loading v-if="loading" />
      <div v-else class="collection col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <Breadcrumbs v-if="collection.name" :current="title" />
        <h1 id="collectionTitle">{{ title }}</h1>
        <p v-if="collection.description" id="collectionDescription">
          {{ collection.description }}
        </p>
        <p id="itemsCount">
          {{ $t("Items") }}: <span class="items-count">{{ nbOfItems }}</span>
        </p>
        <div v-if="isMine" class="collection-dates">
          {{ $t("Last changes:") }} {{ collection.updated }}
        </div>

        <p v-if="isMine" id="manageButtons">
          <router-link
            v-if="collection && Object.keys(collection.properties).length > 0"
            to="item/new"
            id="itemCreateButton"
            class="btn btn-outline-success"
          >
            <i class="bi bi-plus-lg"></i> {{ $t("Create an item") }}
          </router-link>
          &nbsp;
          <router-link
            v-if="collection"
            to="import/item"
            id="importItemButton"
            class="btn btn-outline-primary"
          >
            <i class="bi bi-box-arrow-in-down-left"></i> {{ $t("Import") }}
          </router-link>
          &nbsp;
          <router-link
            to="manage/"
            id="collectionManageButton"
            class="btn btn-outline-secondary"
          >
            <i class="bi-gear-fill"></i> {{ $t("Manage") }}
          </router-link>
        </p>

        <template v-if="Object.keys(collection.properties).length == 0">
          <Empty
            v-if="isMine"
            :label="$t('No items') + ' ' + $t('Create first item')"
          />
          <Empty v-else :label="$t('No items')" />
        </template>

        <div v-if="items" :class="'container items items-' + displayMode">
          <template v-if="nbOfItems == 0">
            <Empty
              v-if="isMine"
              :label="$t('No items') + ' ' + $t('Create first item')"
            />
            <Empty v-else :label="$t('No items')" />
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
        <!-- end of items list -->

        <nav v-if="itemsPerPage > 0 && nbOfItems > 0" aria-label="Page navigation">
          <ul class="pagination pagination-lg justify-content-center">
            <li
              v-for="p in maxPage()" :key="p"
              :class="'page-item' + (p == page ? ' active' : '')"
            >
              <a
                :href="(p == page ? '#' : reloadUrl(filters, sorting, p))"
                class="page-link"
              >
                {{ p }}
              </a>
            </li>
          </ul>
        </nav>
        <!-- end of navigation pages -->

      </div>
      <!-- end of collection container -->
    </div>
    <!-- end of row -->
  </div>
  <!-- end of container-fluid -->
</template>

<style scoped>
.collection-dates {
  margin-bottom: 1em;
  text-align: right;
  font-style: italic;
}

#manageButtons {
  text-align: right;
}
</style>

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
        updated: null,
      },
      items: null,
      nbOfItems: 0,
      displayMode: "shop",
      itemsPerPage: 100,
      page: 1,
      error: false,
      filters: [],
      sorting: "",
      search: "",
      loading: true,
    }
  },
  created() {
    // get display mode from user local config
    if (localStorage.getItem("onmyshelf_displayMode")) {
      this.displayMode = localStorage.getItem("onmyshelf_displayMode")
    }

    // get items per page to display from user local config
    if (localStorage.getItem("onmyshelf_itemsPerPage")) {
      this.itemsPerPage = localStorage.getItem("onmyshelf_itemsPerPage")
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

    // get page number
    if (this.$route.query.page) {
      this.page = this.$route.query.page
      options.params.limit = this.itemsPerPage
      options.params.offset = (this.page - 1) * this.itemsPerPage
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
        this.collection.updated = response.data.updated

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
        this.error = this.$apiErrorStatus(e)
        this.loading = false
      })

    // get items
    this.$apiGet("collections/" + this.collection.id + "/items", options)
      .then((response) => {
        this.items = response.data.items
        this.nbOfItems = response.data.total
        this.loading = false
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
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
    getFilter(name) {
      let filter = this.filters.filter((f) => f.name == name)
      if (filter.length == 0) {
        return false
      }
      return filter[0]
    },

    reloadUrl(filters = this.filters, sorting = this.sorting, page = this.page) {
      var query = []

      // append filters
      filters.forEach((filter) => {
        query.push("p_" + filter.name + "=" + encodeURIComponent(filter.value))
      })

      // append sortby
      if (sorting) {
        query.push("sort=" + sorting)
      }

      // append page
      query.push("page=" + page)

      return "?" + query.join("&")
    },

    toggleDisplay(mode) {
      this.displayMode = mode
      localStorage.setItem("onmyshelf_displayMode", mode)
    },

    changeItemsPerPage(nb) {
      // save config
      localStorage.setItem("onmyshelf_itemsPerPage", nb)

      // reset page
      this.page = 1

      // reload collection
      document.location = this.reloadUrl()
    },

    sortBy(property) {
      // reload collection
      document.location = this.reloadUrl(this.filters, property)
    },

    filterBy(name, value) {
      // get all filters except this property
      let filters = this.filters.filter((f) => f.name != name)
      // append filter
      filters.push({
        name: name,
        value: value
      })

      // reload collection
      document.location = this.reloadUrl(filters)
    },

    toggleSidebar() {
      let sidebar = document.getElementById("sidebarMenu")

      if (sidebar.style.display == "block") {
        sidebar.style.display = "none"
      } else {
        sidebar.style.display = "block"
      }
    },

    // returns the maximum of pages to display
    maxPage() {
      let max = Math.floor(this.nbOfItems / this.itemsPerPage)

      if (this.nbOfItems % this.itemsPerPage > 0) {
        max++
      }

      return max
    },
  },
}
</script>
