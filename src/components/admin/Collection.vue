<template>
  <Error v-if="errors.length > 0" />
  <div v-else class="container-fluid">
    <div class="row">
      <div class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <h1>
          <Translation v-if="name && Object.keys(name).length > 0" :text="name" />
          <template v-else>Collection {{ $route.params.cid }}</template>
        </h1>
        <p v-if="description && Object.keys(description).length > 0">
          <Translation :text="description" />
        </p>
        <p v-if="visibility !== null">Visibility: <Visibility :level=visibility /></p>
        <p>
          <router-link to="edit" class="btn btn-primary">
            <i class="bi-pencil"></i>&nbsp;Edit collection details
          </router-link>
        </p>
        <p>
          <router-link :to="'/collection/' + id + '/'" class="btn btn-outline-success">
            <i class="bi-eye"></i>&nbsp;Show collection
          </router-link>
        </p>

        <h2>Properties</h2>
        <div v-if="properties">
          <router-link to="property/new" class="btn btn-success mb-3">
            Create a new property
          </router-link>

          <div v-if="Object.keys(properties).length == 0" class="alert alert-warning" role="alert">
            Items are defined by properties.
            <router-link to="property/new">
              Create your first property!
            </router-link>
          </div>
          <table v-else class="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Visibility</th>
                <th scope="col">Order</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(property, name) of properties" :key="name">
                <td scope="row">
                  <template v-if="this.$translate(property.label)">{{ this.$translate(property.label) }}</template>
                  <template v-else>{{ name }}</template>
                </td>
                <td scope="row">
                  <template v-if="propertyTypes[property.type]">
                    <strong v-if="property.isTitle">Item title</strong>
                    <strong v-else-if="property.isSubTitle">Item subtitle</strong>
                    <strong v-else-if="property.isCover">Item cover</strong>
                    <template v-else>{{ propertyTypes[property.type].label }}</template>
                  </template>
                </td>
                <td>
                  <Visibility :level="property.visibility >= visibility ? property.visibility : visibility" />
                  <template v-if="property.preview">
                    ,&nbsp;<a title="In item summary"><i class="bi-bookmark-fill"></i></a>
                  </template>
                </td>
                <td>
                  <a title="Move up" @click="orderProperty(name)"><i class="bi bi-arrow-up-circle-fill"></i></a>&nbsp;
                  <a title="Move down" @click="orderProperty(name, -1)"><i class="bi bi-arrow-down-circle"></i></a>
                </td>
                <td>
                  <router-link :to="'property/' + name" class="btn btn-primary">Edit</router-link>&nbsp;
                  <router-link :to="'property/' + name + '/delete'" class="btn btn-danger">Delete</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Loading v-else />

        <div v-if="properties && Object.keys(properties).length > 0">
          <h2>Items</h2>
          <div class="mb-3">
            <router-link :to="'/collection/' + id + '/item/new'" class="btn btn-success">Create a new item</router-link>
            &nbsp;<router-link to="import" class="btn btn-outline-primary">Import items</router-link>
          </div>
          <p v-if="items">Total: {{ items.length }}</p>
          <div v-if="items" class="items">
            <div v-if="items.length == 0" class="alert alert-info" role="alert">
              You have no item yet.
              <router-link :to="'/collection/' + id + '/new'">
                Create your first item
              </router-link>
              or
              <router-link :to="'/collection/' + id + '/import'">
                import items
              </router-link>
            </div>
            <table v-else class="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Visibility</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item of items" :key="item.id">
                  <th scope="row">{{ item.id }}</th>
                  <td>
                    <router-link :to="'/collection/' + id + '/item/' + item.id + '/'">
                      <template v-if="item.properties && titleProperty && item.properties[titleProperty]">
                        {{ item.properties[titleProperty] }}
                      </template>
                      <template v-else>Item {{ item.id }}</template>
                    </router-link>
                  </td>
                  <td>
                    <Visibility :level="item.visibility >= visibility ? item.visibility : visibility" />
                  </td>
                  <td>
                    <router-link :to="'/collection/' + id + '/item/' + item.id + '/edit'" class="btn btn-primary">Edit</router-link>&nbsp;
                    <router-link :to="'/collection/' + id + '/item/' + item.id + '/delete'" class="btn btn-danger">Delete</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Loading v-else />
        </div>

        <div>
          <h3>Advanced</h3>
          <div class="card mb-3">
            <div class="card-header">
              <strong>Import collection</strong>
            </div>
            <div class="card-body">
              <p class="card-text">
                Import collection from CSV, GCstar, Tellico, ... (experimental, no images imported yet)
              </p>
              <router-link to="import" class="btn btn-primary">
                Import collection
              </router-link>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <strong>Delete collection</strong>
            </div>
            <div class="card-body">
              <p class="card-text">Delete entire collection.</p>
              <router-link to="delete" class="btn btn-danger">Delete collection</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import Translation from "@/components/properties/Translation.vue"
import Visibility from "@/components/properties/Visibility.vue"

export default {
  components: {
    Error,
    Loading,
    Translation,
    Visibility,
  },
  data() {
    return {
      id: this.$route.params.cid,
      name: null,
      description: null,
      cover: null,
      visibility: null,
      properties: null,
      items: null,
      errors: [],
      titleProperty: null,
    }
  },
  inject: ["propertyTypes"],
  created() {
    // get collection details
    axios.get(import.meta.env.VITE_API_URL + "/collections/" + this.id, this.$apiConfig())
      .then((response) => {
        this.name = response.data.name
        this.description = response.data.description
        this.cover = response.data.cover
        this.visibility = response.data.visibility
        this.properties = response.data.properties

        // search title property
        if (response.data.properties) {
          for (let key in response.data.properties) {
            if (response.data.properties[key].isTitle) {
              this.titleProperty = key
            }
          }
        }
      })
      .catch((e) => {
        this.errors.push(e)
      })

    // get URL parameters
    let headers = {}
    if (this.$route.query.filterBy) {
      headers = {
        params: {
          filterBy: this.$route.query.filterBy,
          filterValue: this.$route.query.filterValue,
        },
      }
    }

    // get items
    axios.get(import.meta.env.VITE_API_URL + "/collections/" + this.id + "/items", this.$apiConfig(headers))
      .then((response) => {
        this.items = response.data
      })
      .catch((e) => {
        this.errors.push(e)
      })
  },
  methods: {
    // order property
    orderProperty(name, increment = 1) {
      let keys = Object.keys(this.properties)

      // one property: do nothing
      if (keys.length <= 1) {
        return
      }

      for (let i = 0; i < keys.length; i++) {
        if (keys[i] != name) {
          continue
        }

        let data = {}
        let otherProperty = null
        let otherData = null

        // increment
        if (increment > 0) {
          // max: do nothing
          if (i == 0) {
            return
          }

          otherProperty = keys[i-1]
          if (this.properties[otherProperty].order > this.properties[name].order) {
            otherData = { order: this.properties[name].order }
          }
          data = { order: this.properties[name].order + 1 }
        } else {
          // decrement
          // min: do nothing
          if (i >= keys.length - 1) {
            return
          }

          otherProperty = keys[i + 1]
          if (this.properties[otherProperty].order < this.properties[name].order) {
            otherData = { order: this.properties[name].order }
          }
          data = { order: this.properties[name].order - 1 }
        }

        // API call to update property
        axios.patch(import.meta.env.VITE_API_URL + "/collections/" + this.id + "/properties/" + name, data, this.$apiConfig())
          .then(() => {
            document.location.reload()
          })

        if (otherData) {
          // API call to update other property
          axios.patch(import.meta.env.VITE_API_URL + "/collections/" + this.id + "/properties/" + otherProperty, otherData, this.$apiConfig())
            .then(() => {
              document.location.reload()
            })
        }

        // quit loop
        return
      }
    },
  },
}
</script>
