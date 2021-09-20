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
        <a href="field/new" class="btn btn-outline-primary">Add field</a>
        <div v-if="fields">
          <div v-if="fields.length == 0" class="alert alert-warning" role="alert">
            No fields. Click on "Add field" button above to create the fields that defines your collection.
          </div>
          <table v-else class="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Label</th>
                <th scope="col">Type</th>
                <th scope="col">Visibility</th>
                <th scope="col">Order</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, name) of fields" :key="name">
                <td scope="row">{{name}}</td>
                <td scope="row">{{this.$translate(field.label)}}</td>
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
                  <button @click="deleteField(name)" class="btn btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div><!-- if fields -->
        <Loading v-else />

        <div v-if="fields">
          <h2>Items</h2>
          <a href="" class="btn btn-outline-primary">Create new item</a>
          <p v-if="items">Total: {{items.length}}</p>
          <div v-if="items" class="items">
            <Empty v-if="items.length == 0" />
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
                    <template v-if="item.fields && titleField && item.fields[titleField]">{{item.fields[titleField]}}</template>
                    <template v-else>Item {{item.id}}</template>
                  </td>
                  <td>
                    <Visibility :level="item.visibility >= visibility ? item.visibility : visibility" />
                  </td>
                  <td>
                    <a :href="'/collection/'+id+'/item/'+item.id+'/'" class="btn btn-outline-primary">See</a>&nbsp;
                    <a :href="'/collection/'+id+'/item/'+item.id+'/edit'" class="btn btn-primary">Edit</a>&nbsp;
                    <button @click="deleteItem(item.id)" class="btn btn-danger">Delete</button>
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
              <a href="#" class="btn btn-primary">Import items</a>
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
              <a href="#" @click="deleteCollection" class="btn btn-danger">Delete collection</a>
            </div>
          </div><!-- card -->
        </div><!-- end of advanced section -->
      </div>
    </div><!-- .row -->
  </div><!-- .container-fluid -->
</template>

<script>
import axios from 'axios'
import Empty from '@/components/Empty.vue'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'
import Translation from '@/components/fields/Translation.vue'
import Visibility from '@/components/fields/Visibility.vue'

export default {
  components: {
    Empty,
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
      titleField: null,
      coverField: null,
      displayMode: 'list'
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
          if (response.data.fields[key].isCover) {
            this.coverField = key
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
    },
    deleteField(id) {
      // API call to delete field
      axios.delete(process.env.VUE_APP_API_URL + '/collections/' + this.id + '/fields/' + id, this.$apiConfig())
      .then(() => {
        document.location.reload()
      })
      .catch(e => {
        console.log(e)
        alert('Error')
      })
    },
    deleteItem(id) {
      // API call to delete collection
      axios.delete(process.env.VUE_APP_API_URL + '/collections/' + this.id + '/items/' + id, this.$apiConfig())
      .then(() => {
        document.location.reload()
      })
      .catch(e => {
        console.log(e)
        alert('Error')
      })
    },
    deleteCollection() {
      // API call to delete collection
      axios.delete(process.env.VUE_APP_API_URL + '/collections/' + this.id, this.$apiConfig())
      .then(() => {
        document.location.href = '/'
      })
      .catch(e => {
        console.log(e)
        alert('Error')
      })
    }
  }
}
</script>
