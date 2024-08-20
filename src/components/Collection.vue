<template>
  <Error v-if="error" :status="error" />
  <Item v-else-if="item" />
  <div v-else class="container-fluid">
    <button class="navbar-toggler" type="button" @click="toggleSidebar()">
      <i class="bi bi-list" style="font-size: 2em"></i>
    </button>
    <div class="row">
      <Loading v-if="loading" />
      <div
        id="sidebarMenu"
        class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
      >
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

          <div
            v-if="collection && Object.keys(collection.properties).length > 0"
            class="position-sticky pt-3"
          >
            <h4>{{ $t("Sort by") }}</h4>
            <div
              class="input-group"
              role="group"
              aria-label="Button group with nested dropdown"
            >
              <select @change="sortBy($event.target.value)" class="form-select">
                <template
                  v-for="(property, name) of collection.properties"
                  :key="name"
                >
                  <option
                    v-if="property.isTitle || property.sortable"
                    :value="name"
                    :selected="sorting == name || sorting == '-' + name"
                  >
                    {{ $translate(property.label) ? $translate(property.label) : name }}
                  </option>
                </template>
                <option
                  value="created"
                  :selected="sorting.match(/^-*created$/)"
                >
                  {{ $t("Creation date") }}
                </option>
              </select>
              <button
                type="button"
                :class="'btn ' + (sorting.substring(0, 1) != '-' ? 'btn-secondary' : 'btn-outline-secondary')"
              >
                <a
                  :href="sorting.substring(0, 1) == '-' ? reloadUrl(filters, sorting.substring(1)) : '#'"
                >
                  <i class="bi bi-sort-down-alt" />
                </a>
              </button>
              <button
                type="button"
                :class="'btn ' + (sorting.substring(0, 1) == '-' ? 'btn-secondary' : 'btn-outline-secondary')"
              >
                <a
                  :href="sorting.substring(0, 1) != '-' ? reloadUrl(filters, '-' + sorting) : '#'"
                >
                  <i class="bi bi-sort-up" />
                </a>
              </button>
            </div>
            <!-- end of select sorting -->

            <div class="position-sticky pt-3">
              <h4>{{ $t("Filter by") }}</h4>
              <label>{{ $t("Item title") }}:</label>
              <a
                v-if="titleSearch"
                href="#"
                class="ms-2"
                :title="$t('Delete filter')"
                @click="titleSearch = ''"
              >
                <i class="bi bi-x-circle"></i>
              </a>
              <input
                v-model="titleSearch"
                type="text"
                class="form-control"
                :placeholder="$t('Search')"
              />
              <template
                v-for="(property, filterName) of collection.properties"
                :key="filterName"
              >
                <div
                  v-if="property.filterable && property.values.length > 0"
                  class="filter mt-2"
                >
                  <PropertyLabel
                    :name="filterName"
                    :property="collection.properties[filterName]"
                  />
                  <a
                    v-if="getFilter(filterName)"
                    :href="reloadUrl(filters.filter(f => f.name != filterName), sorting, 1)"
                    :title="$t('Delete filter')"
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
                        <option
                          :value="filter"
                          :selected="getFilter(filterName) && getFilter(filterName).value == '>' + filter"
                        >
                          {{ filter }}+
                        </option>
                      </template>
                    </select>
                    <template
                      v-else-if="collection.properties[filterName].type == 'yesno'"
                    >
                      <div class="form-check">
                        <input
                          type="radio"
                          class="form-check-input"
                          @change="filterBy(filterName, true)"
                          :checked="getFilter(filterName) && getFilter(filterName).value == 'true'"
                        />
                        <label class="form-check-label">
                          {{ $t("Yes") }}
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          type="radio"
                          class="form-check-input"
                          @change="filterBy(filterName, false)"
                          :checked="getFilter(filterName) && getFilter(filterName).value == 'false'"
                        />
                        <label class="form-check-label">
                          {{ $t("No") }}
                        </label>
                      </div>
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

              <div class="filter mt-2">
                {{ $t("Lent") }}:
                <a
                  v-if="filterLent !== null"
                  title="Clear filter"
                  @click="filterLent = null"
                >
                  <i class="bi bi-x-circle" />
                </a>
                <div class="form-check">
                  <input
                    type="radio"
                    class="form-check-input"
                    @change="filterLent = true"
                    :checked="filterLent === true"
                  />
                  <label class="form-check-label">
                    {{ $t("Yes") }}
                  </label>
                </div>
                <div class="form-check">
                  <input
                    type="radio"
                    class="form-check-input"
                    @change="filterLent = false"
                    :checked="filterLent === false"
                  />
                  <label class="form-check-label">
                    {{ $t("No") }}
                  </label>
                </div>
              </div>
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
                v-for="i in [20, 100, 200]"
                :key="i"
                :value="i"
                :selected="itemsPerPage == i"
              >
                {{ i }}
              </option>
              <option value="0" :selected="itemsPerPage == 0">
                {{ $t("Unlimited") }}
              </option>
            </select>
          </div>
          <!-- end of select nb of items/page -->
        </div>
        <!-- end of position-sticky -->
      </div>
      <!-- end of sidebar -->

      <div
        v-if="!loading"
        class="collection col-md-9 ms-sm-auto col-lg-10 px-md-4"
      >
        <Breadcrumbs v-if="collection.name" :current="title" />
        <h1 id="collectionTitle">{{ title }}</h1>
        <p v-if="collection.description" id="collectionDescription">
          {{ collection.description }}
        </p>
        <p>
          {{ $t("Items") }}:
          <span id="itemsCount" class="items-count">{{ nbOfItems }}</span>
        </p>
        <p v-if="isMine" class="collection-dates">
          {{ $t("Last changes") }}: {{ collection.updated }}
        </p>

        <div v-if="isMine" id="manageButtons">
          <router-link
            v-if="collection && Object.keys(collection.properties).length > 0"
            to="item/new"
            id="itemCreateButton"
            class="btn btn-outline-success me-3"
          >
            <i class="bi bi-plus-lg" /> {{ $t("Create an item") }}
          </router-link>
          <router-link
            v-if="collection"
            to="import/item"
            id="importItemButton"
            class="btn btn-outline-primary me-3"
          >
            <i class="bi bi-box-arrow-in-down-left" /> {{ $t("Import") }}
          </router-link>
          <router-link
            to="manage/"
            id="collectionManageButton"
            class="btn btn-outline-secondary"
          >
            <i class="bi-gear-fill" /> {{ $t("Manage") }}
          </router-link>
        </div>

        <form @submit="searchItems">
          <div class="input-group mt-3" role="group">
            <button
              v-if="$route.query.search"
              type="button"
              class="btn btn-outline-secondary"
              :title="$t('Delete search')"
              @click="cleanSearch()"
            >
              <i class="bi bi-x-lg" />
            </button>
            <input
              v-model="search"
              type="text"
              class="form-control"
              :placeholder="$t('Search item')"
            />
            <button
              type="submit"
              class="btn btn-outline-secondary"
              :disabled="!search"
            >
              <i class="bi bi-search me-2" />{{ $t("Search") }}
            </button>
          </div>
        </form>

        <div
          v-if="items"
          :class="'container items items-' + displayMode + ' ' + (displayMode == 'shop' ? 'row' : '')"
        >
          <template v-if="nbOfItems == 0">
            <Empty
              v-if="isMine"
              :label="$t('No items') + ' ' + $t('Create first item')"
            />
            <Empty v-else :label="$t('No items')" />
          </template>
          <template v-else>
            <template v-for="item of items" :key="item.id">
              <template
                v-if="(!titleSearch || itemTitle(item).toLowerCase().includes(titleSearch.toLowerCase())) && (filterLent === null || filterLent == item.lent)"
              >
                <PreviewList
                  v-if="displayMode == 'list'"
                  :item="item"
                  :title="itemTitle(item)"
                  :cover="itemCover(item)"
                  :id="'item-' + item.id"
                />
                <PreviewMosaic
                  v-else-if="displayMode == 'mosaic'"
                  :item="item"
                  :title="itemTitle(item)"
                  :cover="itemCover(item)"
                  :id="'item-' + item.id"
                />
                <PreviewShop
                  v-else
                  :item="item"
                  :title="itemTitle(item)"
                  :cover="itemCover(item)"
                  :id="'item-' + item.id"
                />
              </template>
            </template>
          </template>
        </div>
        <!-- end of items list -->

        <nav
          v-if="itemsPerPage > 0 && nbOfItems > 0"
          aria-label="Page navigation"
        >
          <ul class="pagination pagination-lg justify-content-center">
            <li
              v-for="p in rangePages()"
              :key="p"
              :class="'page-item' + (p == page ? ' active' : '')"
            >
              <span v-if="p == '...'" class="page-link">...</span>
              <a
                v-else
                :href="p == page ? '#' : reloadUrl(filters, sorting, p)"
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
import Item from "@/components/Item.vue"
import Loading from "@/components/Loading.vue"

export default {
  components: {
    Breadcrumbs,
    Empty,
    Error,
    Item,
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
      item: null,
      error: false,
      filters: [],
      sorting: "",
      search: "",
      titleSearch: "",
      filterLent: null,
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

    // get search
    if (this.$route.query.search) {
      options.params.search = this.$route.query.search
      this.search = decodeURIComponent(this.$route.query.search)
    }

    // get sorting
    if (this.$route.query.sort) {
      options.params.sort = this.$route.query.sort
      this.sorting = this.$route.query.sort
    }

    // get page number
    if (this.$route.query.page) {
      this.page = this.$route.query.page
    }

    // set limit & offset
    options.params.limit = this.itemsPerPage
    options.params.offset = (this.page - 1) * this.itemsPerPage

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
        this.collection.borrowable = response.data.borrowable
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
    getItem(itemId) {
      this.$apiGet("collections/" + this.collection.id + "/items/" + itemId)
        .then((response) => {
          this.item = response.data
        })
        .catch((e) => {
          this.error = this.$apiErrorStatus(e)
        })
    },

    itemTitle(item) {
      if (item.properties[this.collection.titleProperty]) {
        return item.properties[this.collection.titleProperty]
      } else {
        return "Item " + item.id
      }
    },

    itemCover(item) {
      if (item.properties[this.collection.coverProperty]) {
        if (item.thumbnail.normal) {
          return item.thumbnail.normal
        } else {
          return item.properties[this.collection.coverProperty]
        }
      } else {
        if (this.collection.thumbnail.normal) {
          return this.collection.thumbnail.normal
        } else {
          return this.collection.cover
        }
      }
    },

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

      // append search
      if (this.search) {
        query.push("search=" + encodeURIComponent(this.search))
      }

      // append page
      if (page > 1) {
        query.push("page=" + page)
      }

      return "?" + query.join("&")
    },

    toggleDisplay(mode) {
      this.displayMode = mode
      localStorage.setItem("onmyshelf_displayMode", mode)
    },

    changeItemsPerPage(nb) {
      // save config
      localStorage.setItem("onmyshelf_itemsPerPage", nb)

      // reset page & reload
      this.page = 1
      document.location = this.reloadUrl()
    },

    searchItems(e) {
      // prevent form to reload page
      e.preventDefault()

      // reset page & reload
      this.page = 1
      document.location = this.reloadUrl()
    },

    cleanSearch() {
      this.page = 1
      this.search = ""
      document.location = this.reloadUrl()
    },

    sortBy(property) {
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

      // reset page & reload
      this.page = 1
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

    // returns array for pagination
    rangePages() {
      let max = Math.floor(this.nbOfItems / this.itemsPerPage)

      if (this.nbOfItems % this.itemsPerPage > 0) {
        max++
      }

      let pages = [1]

      // if single page, quit
      if (max == 1) {
        return pages
      }

      let limit = 2
      let startPage = parseInt(this.page)

      for (let p = 2; p < max; p++) {
        if (p > startPage + limit) {
          pages.push("...")
          break
        }

        if (p < startPage - limit) {
          continue
        }

        if (p == startPage - limit) {
          if (p > limit) {
            pages.push("...")
          }
        }

        pages.push(p)
      }

      // append last page
      pages.push(max)

      return pages
    },
  },
}
</script>
