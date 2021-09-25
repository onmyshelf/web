<template>
  <div class="container">
    <Error v-if="errors.length > 0" />
    <template v-else>
      <h1>
        <template v-if="id">Edit item {{id}}</template>
        <template v-else>New item</template>
      </h1>
      <Loading v-if="loading"/>
      <form v-if="item && item.fields">
        <div v-for="(field, name) in collection.fields" :key="name" class="item-preview mb-3">
          <label :for="name" class="form-label">
            <template v-if="field.label && field.label.length > 0">{{this.$translate(field.label)}}</template>
            <template v-else>{{name}}</template>:&nbsp;
          </label>
          <div class="input-group">
          <template v-if="field.type == 'longtext'">
            <textarea v-model="edit[name]" class="form-control" rows="3"></textarea>
          </template>
          <template v-else-if="field.type == 'rating'">
            <input v-model="edit[name]" type="number" min=0 max=5 step=1
              class="form-control" :required=field.required>
          </template>
          <template v-else-if="field.type == 'date'">
            <input v-model="edit[name]" type="date" class="form-control" :required=field.required>
          </template>
          <template v-else-if="field.type == 'yesno'">
            <div class="form-check">
              <input v-model="edit[name]" class="form-check-input" type="checkbox">
            </div>
          </template>
          <MediaSelector v-else-if="field.type == 'image'" type="image" v-model="edit[name]" />
          <MediaSelector v-else-if="field.type == 'video'" type="video" v-model="edit[name]" />
          <input v-else-if="field.type == 'url'" v-model="edit[name]" :required=field.required
            type="text" class="form-control" placeholder="e.g. https://mywebsite.com">
          <input v-else v-model="edit[name]" :type="field.type" class="form-control" :required=field.required>
          <span v-if="field.suffix" class="input-group-text">{{field.suffix}}</span>
          </div>

          <button v-if="field.multiple" type="button" class="btn btn-outline-primary">+ add value</button>
        </div>

        <div class="mb-3">
          <button class="btn btn-primary" type="submit">Save changes</button>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'
import MediaSelector from './fields/MediaSelector.vue'

export default {
  components: {
    Error,
    Loading,
    MediaSelector
  },
  data() {
    return {
      id: this.$route.params.id,
      item: null,
      loading: true,
      collection: [],
      edit: {},
      errors: []
    }
  },
  inject: ['visibilityLevels'],
  created() {
    // new collection: do not load data
    if (!this.id) {
      this.loading = false
      return
    }

    // get collection
    axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.$route.params.cid, this.$apiConfig())
    .then(response => {
      this.collection = response.data

      // translate name
      if (response.data.name) {
        this.collection.name = this.$translate(response.data.name)
      } else {
        this.collection.name = 'Collection ' + this.id
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
    axios.get(process.env.VUE_APP_API_URL + '/collections/' + this.$route.params.cid + '/items/' + this.$route.params.id, this.$apiConfig())
    .then(response => {
      this.item = response.data
      this.edit = this.item.fields

      this.loading = false
    })
    .catch(e => {
      this.errors.push(e)
    })
  }
}
</script>
