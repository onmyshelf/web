<template>
  <Error v-if="errors.length > 0" />
  <div v-else class="collections container">
    <p v-if="isLoggedIn">
      <a href="collection/new" class="btn btn-outline-primary">Create a collection</a>
    </p>
    <Loading v-if="loading"/>
    <template v-if="collections">
      <Empty v-if="collections.length == 0" label="No collections yet. Create your first collection!"/>
      <template v-else>
        <!-- TODO: enable when multi-user will be supported -->
        <div v-if="isLoggedIn && false">
          <div class="form-check">
            <input v-model="filterMine" class="form-check-input" type="checkbox" id="filterMine">
            <label class="form-check-label" for="filterMine">
              Display only my collections
            </label>
          </div>
        </div>

        <template v-for="collection of collections" :key="collection.id" class="row">
          <div v-if="!filterMine || collection.owner == this.$currentUserId()" class="row">
            <div class="col-4 item-cover">
              <a :href="'collection/'+collection.id+'/'">
                <Image :url="collection.cover" :cover=true style="max-height:8em" />
              </a>
            </div>
            <div class="col">
              <a :href="'collection/'+collection.id+'/'">
                <h1>
                  <template v-if="collection.name">{{collection.name}}</template>
                  <template v-else>Collection {{collection.id}}</template>
                </h1>
              </a>
              <p v-if="collection.description">
                <template v-if="collection.description">{{collection.description}}</template>
              </p>
              <p>Items: {{collection.items}}</p>
              <div v-if="collection.owner == this.currentUserID">
                <!-- TODO: enable when multi-user will be supported -->
                <p v-if="false"><span class="badge bg-secondary">Mine</span></p>
                <a :href="'collection/'+collection.id+'/manage/'" class="btn btn-outline-primary"><i class="bi-pencil"></i> Manage</a>
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
import Image from './fields/medias/Image.vue'
import Empty from '@/components/Empty.vue'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'

export default {
  components: {
    Image,
    Empty,
    Error,
    Loading
  },
  data() {
    return {
      loading: true,
      collections: null,
      errors: [],
      isLoggedIn: false,
      currentUserID: null,
      filterMine: false
    }
  },
  created() {
    this.isLoggedIn = this.$isLoggedIn()
    if (this.isLoggedIn) {
      this.currentUserID = this.$currentUserId()
    }

    // get collections list
    axios.get(process.env.VUE_APP_API_URL + '/collections', this.$apiConfig())
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
