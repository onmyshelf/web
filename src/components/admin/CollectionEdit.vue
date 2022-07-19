<template>
  <div class="container">
    <h1>
      <template v-if="id">Edit collection {{ id }}</template>
      <template v-else>New collection</template>
    </h1>
    <Loading v-if="loading"/>
    <form v-else @submit="validate">
      <div class="mb-3">
        <label class="form-label">Collection name</label>
        <input v-model="edit.name" type="text" class="form-control" placeholder="e.g. My books" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Collection description (optional)</label>
        <textarea v-model="edit.description" placeholder="e.g. My collection of..."
          class="form-control" rows="3" ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Who can see this collection?</label>
        <Visibility v-model="edit.visibility" max="3" />
      </div>

      <div class="mb-3">
        <label class="form-label">Collection image</label>
        <MediaSelector type="image" v-model="edit.cover" />
      </div>

      <div class="mt-3">
        <button class="btn btn-primary" type="submit" :disabled="$demoMode()">
          <template v-if="id">Save changes</template>
          <template v-else>Create collection</template>
        </button>&nbsp;
        <a v-if="id" href="." class="btn btn-outline-secondary">Cancel</a>
        <router-link v-else to="/" class="btn btn-outline-secondary">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue"
import MediaSelector from "./properties/MediaSelector.vue"
import Visibility from "./properties/Visibility.vue"

export default {
  components: {
    Loading,
    MediaSelector,
    Visibility,
  },
  data() {
    return {
      loading: true,
      id: this.$route.params.cid,
      edit: { visibility: 0 },
    }
  },
  inject: ["visibilityLevels"],
  created() {
    // new collection: do not load data
    if (!this.id) {
      this.loading = false
      return
    }

    // get collection details
    this.$apiGet("collections/" + this.id)
    .then((response) => {
      this.edit = response.data

      this.edit.name = this.$translate(response.data.name)
      this.edit.description = this.$translate(response.data.description)

      // end of loading
      this.loading = false
    })
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.edit)

      data.name = this.$i18nObject(data.name)

      if (data.description) {
        data.description = this.$i18nObject(data.description)
      }

      // API call
      if (this.id) {
        // modify collection
        this.$apiPatch("collections/" + this.id, data).then(() => {
          document.location.href = "/collection/" + this.id + "/manage/"
        })
      } else {
        // create new collection
        this.$apiPost("collections", data).then((response) => {
          document.location.href = "/collection/" + response.data.id + "/manage/"
        })
      }
    },
  },
}
</script>
