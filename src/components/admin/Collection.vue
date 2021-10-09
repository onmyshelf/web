<template>
  <Error v-if="errors.length > 0" />
  <div v-else class="container-fluid">
    <div class="row">
      <div class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <h1>
          <Translation v-if="name && Object.keys(name).length > 0" :text=name />
          <template v-else>Collection {{ $route.params.cid }}</template>
        </h1>
        <p v-if="description && Object.keys(description).length > 0">
          <Translation :text=description />
        </p>
        <p v-if="visibility !== null">Visibility: <Visibility :level=visibility /></p>
        <p>
          <a href="edit" class="btn btn-outline-primary"><i class="bi-pencil"></i>&nbsp;Edit collection</a>
        </p>

        <h2>Fields</h2>
        <div v-if="fields">
          <a href="field/new" class="btn btn-outline-success mb-3">Create a new field</a>
          <div v-if="Object.keys(fields).length == 0" class="alert alert-warning" role="alert">
            Items are defined by fields. <a href="field/new">Create your first field!</a>
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
              <tr v-for="(field, name) of fields" :key="name">
                <td scope="row">
                  <template v-if="this.$translate(field.label)">{{this.$translate(field.label)}}</template>
                  <template v-else>{{name}}</template>
                </td>
                <td scope="row">
                  <template v-if="fieldTypes[field.type]">
                    <strong v-if="field.isTitle">Item title</strong>
                    <strong v-else-if="field.isSubTitle">Item subtitle</strong>
                    <strong v-else-if="field.isCover">Item cover</strong>
                    <template v-else>{{fieldTypes[field.type].label}}</template>
                  </template>
                </td>
                <td>
                  <Visibility :level="field.visibility >= visibility ? field.visibility : visibility" />
                  <template v-if="field.preview">,&nbsp;<a title="In item summary"><i class="bi-bookmark-fill"></i></a></template>
                </td>
                <td>
                  <a title="Move up" @click="orderField(name)"><i class="bi bi-arrow-up-circle-fill"></i></a>&nbsp;
                  <a title="Move down" @click="orderField(name, -1)"><i class="bi bi-arrow-down-circle"></i></a>
                </td>
                <td>
                  <a :href="'field/'+name" class="btn btn-primary">Edit</a>&nbsp;
                  <a :href="'field/'+name+'/delete'" class="btn btn-danger">Delete</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div><!-- end of fields section -->
        <Loading v-else />

        <div v-if="fields && Object.keys(fields).length > 0">
          <h2>Items</h2>
          <a :href="'/collection/'+id+'/new'" class="btn btn-outline-success mb-3">Create new item</a>
          <p v-if="items">Total: {{items.length}}</p>
          <div v-if="items" class="items">
            <div v-if="items.length == 0" class="alert alert-info" role="alert">
              You have no item yet. <a :href="'/collection/'+id+'/new'">Create your first item!</a>
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
                  <th scope="row">{{item.id}}</th>
                  <td>
                    <a :href="'/collection/'+id+'/item/'+item.id+'/'">
                      <template v-if="item.fields && titleField && item.fields[titleField]">{{item.fields[titleField]}}</template>
                      <template v-else>Item {{item.id}}</template>
                    </a>
                  </td>
                  <td>
                    <Visibility :level="item.visibility >= visibility ? item.visibility : visibility" />
                  </td>
                  <td>
                    <a :href="'/collection/'+id+'/item/'+item.id+'/edit'" class="btn btn-primary">Edit</a>&nbsp;
                    <a :href="'/collection/'+id+'/item/'+item.id+'/delete'" class="btn btn-danger">Delete</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div><!-- .container .items -->
          <Loading v-else />
        </div><!-- end of items section -->

        <div>
          <h3>Advanced</h3>
          <div class="card">
            <div class="card-header">
              <strong>Import items</strong>
            </div>
            <div class="card-body">
              <p class="card-text">
                Import items from CSV,...
              </p>
              <a href="import" class="btn btn-primary">Import items</a>
            </div>
          </div><!-- card -->
          <p></p>
          <div class="card">
            <div class="card-header">
              <strong>Delete collection</strong>
            </div>
            <div class="card-body">
              <p class="card-text">
                Delete entire collection.
              </p>
              <a href="delete" class="btn btn-danger">Delete collection</a>
            </div>
          </div><!-- card -->
        </div><!-- end of advanced section -->
      </div>
    </div><!-- .row -->
  </div><!-- .container-fluid -->
</template>

<script>
import axios from 'axios'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'
import Translation from '@/components/fields/Translation.vue'
import Visibility from '@/components/fields/Visibility.vue'

export default {
  components: {
    Error,
    Loading,
    Translation,
    Visibility
  },
  data() {
    return {
      id: this.$route.params.cid,
      name: null,
      description: null,
      cover: null,
      visibility: null,
      fields: null,
      items: null,
      errors: [],
      titleField: null
    }
  },
  inject: ['fieldTypes'],
  created() {
    // get URL parameters
    var query = []
    if (this.$route.query.filterBy) {
      query = ['filterBy='+this.$route.query.filterBy, 'filterValue='+this.$route.query.filterValue]
    }

    // get collection details
    axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.id, this.$apiConfig())
    .then(response => {
      this.name = response.data.name
      this.description = response.data.description
      this.cover = response.data.cover
      this.visibility = response.data.visibility
      this.fields = response.data.fields

      // search title field
      if (response.data.fields) {
        for (let key in response.data.fields) {
          if (response.data.fields[key].isTitle) {
            this.titleField = key
          }
        }
      }
    })
    .catch(e => {
      this.errors.push(e)
    })

    // get items
    axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.id + '/items?' + query.join('&'), this.$apiConfig())
    .then(response => {
      this.items = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  methods: {
    // order field
    orderField(name, increment = 1) {
      let keys = Object.keys(this.fields)

      // one field: do nothing
      if (keys.length <= 1) {
        return
      }

      for (let i = 0; i < keys.length; i++) {
        if (keys[i] != name) {
          continue
        }

        let data = {}
        let otherField = null
        let otherData = null

        // increment
        if (increment > 0) {
          // max: do nothing
          if (i == 0) {
            return
          }

          otherField = keys[i-1]
          if (this.fields[otherField].order > this.fields[name].order) {
            otherData = {order: this.fields[name].order}
          }
          data = {order: (this.fields[name].order + 1)}
        } else {
          // decrement
          // min: do nothing
          if (i >= (keys.length-1)) {
            return
          }

          otherField = keys[i+1]
          if (this.fields[otherField].order < this.fields[name].order) {
            otherData = {order: this.fields[name].order}
          }
          data = {order: (this.fields[name].order - 1)}
        }

        // API call to update field
        axios.patch(process.env.VUE_APP_API_URL + '/collections/' + this.id + '/fields/' + name, data, this.$apiConfig())
        .then(() => {
          document.location.reload()
        })

        if (otherData) {
          // API call to update other field
          axios.patch(process.env.VUE_APP_API_URL + '/collections/' + this.id + '/fields/' + otherField, otherData, this.$apiConfig())
          .then(() => {
            document.location.reload()
          })
        }

        // quit loop
        return
      }
    }
  }
}
</script>
