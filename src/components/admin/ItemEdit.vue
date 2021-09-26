<template>
  <div class="container">
    <Error v-if="errors.length > 0" />
    <template v-else>
      <h1>
        <template v-if="id">Edit item {{id}}</template>
        <template v-else>New item</template>
      </h1>
      <Loading v-if="loading"/>
      <form v-else @submit="validate">
        <div v-for="(field, name) in collection.fields" :key="name" class="item-preview mb-3">
          <label :for="name" class="form-label">
            {{label(field.label, name)}}:
            <span v-if="helpField(field)">
              <a title="Informations about this field" data-bs-toggle="collapse" :href="'#help-'+name" 
                aria-expanded="false" :aria-controls="'help-'+name">
                <i class="bi bi-info-circle"></i>
              </a>
              <div class="collapse" :id="'help-'+name">
                <div class="card card-body">
                  {{$translate(field.description)}}
                </div>
              </div>
            </span>
          </label>
          <template v-if="Array.isArray(edit.fields[name])">
            <FieldInput v-for="(value, key) in edit.fields[name]" :key="key" v-model="edit.fields[name][key]" :field=field />
          </template>
          <FieldInput v-else v-model="edit.fields[name]" :field=field />
          <button v-if="field.multiple" type="button" class="btn btn-outline-primary" @click="addValue(name)">+ add value</button>
        </div>

        <div class="mb-3">
          <label class="form-label">Who can see this item?</label>
          <Visibility v-model="edit.visibility" max=3 />
        </div>

        <div class="mb-3">
          <button class="btn btn-primary" type="submit">
            <template v-if="id">Save changes</template>
            <template v-else>Create item</template>
          </button>&nbsp;
          <a href="." class="btn btn-outline-secondary">Cancel</a>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import Error from '@/components/Error.vue'
import FieldInput from './fields/FieldInput.vue'
import Loading from '@/components/Loading.vue'
import Visibility from './fields/Visibility.vue'

export default {
  components: {
    Error,
    FieldInput,
    Loading,
    Visibility
  },
  data() {
    return {
      id: this.$route.params.id,
      collection: {
        id: this.$route.params.cid
      },
      edit: {
        fields: {},
        visibility: 0
      },
      errors: [],
      loading: true,
      help: {}
    }
  },
  inject: ['visibilityLevels'],
  created() {
    // get collection
    axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.collection.id, this.$apiConfig())
    .then(response => {
      this.collection = response.data

      // translate name
      if (response.data.name) {
        this.collection.name = this.$translate(response.data.name)
      } else {
        this.collection.name = 'Collection ' + this.collection.id
      }

      if (!this.id) {
        this.loading = false
      }

      // check if collection is mine; if not, quit
      if (!this.$matchUserId(this.collection.owner)) {
        document.location.href = '..'
      }
    })
    .catch(e => {
      this.errors.push(e)
    })

    // get item
    if (this.id) {
      axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.collection.id + '/items/' + this.id, this.$apiConfig())
      .then(response => {
        this.edit = response.data

        this.loading = false
      })
      .catch(e => {
        this.errors.push(e)
      })
    }
  },
  methods: {
    addValue(fieldName) {
      // transform values to array if not
      if (!Array.isArray(this.edit.fields[fieldName])) {
        this.edit.fields[fieldName] = [this.edit.fields[fieldName]]
      }
      // append empty value
      this.edit.fields[fieldName].push('')
    },
    helpField(field) {
      let translation = this.$translate(field.description)
      if (translation) {
        return translation
      }

      return false
    },
    label(label, name) {
      let translation = this.$translate(label)
      if (translation) {
        return translation
      }
      return name
    },
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      // create/update item
      let url = process.env.VUE_APP_API_URL + '/collections/' + this.collection.id + '/items'
      let protocol = 'post'
      if (this.id) {
          protocol = 'patch'
          url += '/' + this.id
      }

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.edit)

      // API call
      axios[protocol](url, data, this.$apiConfig())
      .then(response => {
        if (!this.id) {
          this.id = response.data.id
        }
        document.location.href = '/collection/'+this.collection.id+'/item/'+this.id+'/'
      })
    }
  }
}
</script>
