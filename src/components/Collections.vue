<template>
  <div class="container">
    <h1>Welcome!</h1>
    <div v-if="$demoMode() && !$isLoggedIn()" class="alert alert-info" role="alert">
      <p>This is a demo instance. You can log in with the following credentials:</p>
      <ul>
        <li>Username: <strong>onmyshelf</strong></li>
        <li>Password: <strong>onmyshelf</strong></li>
      </ul>
      <p>Please note that in demo mode, you can explore all features, but not make any changes.</p>
    </div>
  </div>
  <Error v-if="errors.length > 0" />
  <div v-else class="collections container">
    <p v-if="$isLoggedIn()" class="text-end">
      <router-link to="/collection/new" class="btn btn-outline-success">
        <i class="bi-plus"></i> Create a collection
      </router-link>
    </p>
    <Loading v-if="loading"/>
    <template v-if="collections">
      <template v-if="collections.length == 0">
        <Empty v-if="$isLoggedIn()" label="No collections yet. Create your first collection!"/>
        <Empty v-else label="No collections yet. Login to create your first collection!"/>
      </template>
      <template v-else>
        <div v-if="$isLoggedIn()">
          <div class="form-check">
            <input v-model="filterMine" class="form-check-input" type="checkbox" id="filterMine">
            <label class="form-check-label" for="filterMine">
              Show only my collections
            </label>
          </div>
        </div>

        <template v-for="collection of collections" :key="collection.id" class="row">
          <div v-if="!filterMine || collection.owner == $currentUserId()" class="row">
            <div class="col-4 item-cover">
              <router-link :to="'/collection/'+collection.id+'/'">
                <Image :url="collection.cover" :cover=true style="max-height:8em" />
              </router-link>
            </div>
            <div class="col">
              <router-link :to="'/collection/'+collection.id+'/'">
                <h1>
                  <template v-if="collection.name">{{collection.name}}</template>
                  <template v-else>Collection {{collection.id}}</template>
                </h1>
              </router-link>
              <p v-if="collection.description">
                <template v-if="collection.description">{{collection.description}}</template>
              </p>
              <p>Items: {{collection.items}}</p>
              <div v-if="collection.owner == $currentUserId()">
                <p><span class="badge bg-secondary">Mine</span></p>
                <router-link :to="'/collection/'+collection.id+'/manage/'" class="btn btn-outline-primary">
                  <i class="bi-gear-fill"></i> Manage
                </router-link>
              </div>
            </div>
          </div>
        </template><!-- loop collections -->
      </template>
    </template><!-- if collections -->
  </div>
</template>

<script>
import axios from 'axios'
import Image from './properties/medias/Image.vue'
import Empty from '@/components/Empty.vue'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'

export default {
  components: {
    Image,
    Empty,
    Error,
    Loading,
  },
  data() {
    return {
      loading: true,
      collections: null,
      errors: [],
      filterMine: false
    }
  },
  created() {
    // get API info
    axios.get(import.meta.env.VITE_API_URL + '/', this.$apiConfig())
    .then(response => {
      localStorage.setItem('onmyshelf_readonly', response.data.readonly)
    })
    .catch(e => {})

    // get collections list
    axios.get(import.meta.env.VITE_API_URL + '/collections', this.$apiConfig())
    .then(response => {
      this.collections = response.data

      // translate strings
      for (var i=0; i < this.collections.length; i++) {
        if (this.collections[i].name) {
          this.collections[i].name = this.$translate(this.collections[i].name)
        }
        if (this.collections[i].description) {
          this.collections[i].description = this.$translate(this.collections[i].description)
        }
      }

      this.loading = false
    })
    .catch(e => {
      if (e.response && e.response.status == 401) {
        // delete local token
        this.$cleanSession()
        document.location.reload()
      } else {
        this.errors.push(e)
      }

      this.loading = false
    })
  }
}
</script>
