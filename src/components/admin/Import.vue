<template>
  <div class="container">
    <h1>Import items</h1>
    <form @submit="validate">
      <div class="mb-3">
        <label class="form-label">Source type</label>
        <select v-model="data.type" class="form-select" aria-label="Type of import" required>
          <template v-for="(importModule, name) in importTypes" :key="name">
            <option v-if="importModule.importCollection" :value="name">{{ importModule.name }}</option>
          </template>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Source</label>
        <MediaSelector v-model="data.source" :type="data.type" mandatory="true"/>
      </div>

      <div class="mb-3">
        <button class="btn btn-primary" type="submit" :disabled="$demoMode() || ! data.source || loading">Import</button>&nbsp;
        <a href="." class="btn btn-outline-secondary" :disabled="loading">Cancel</a>
      </div>

      <div v-if="result" :class="'alert alert-'+(result.success ? 'success':'danger')" role="alert">
        {{ result.text }}<br/>
        <router-link :to="'/collection/'+this.collectionId+'/'">View collection</router-link>
      </div>
      <Loading v-if="loading" info="Please wait, this may take some time..."/>
    </form>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue"
import MediaSelector from "./properties/MediaSelector.vue"

export default {
  components: {
    Loading,
    MediaSelector,
  },
  data() {
    return {
      collectionId: this.$route.params.cid,
      loading: false,
      importTypes: {},
      data: {
        source: null,
        type: "csv",
      },
      result: null,
    }
  },
  inject: ["visibilityLevels"],
  created() {
    // get import modules
    this.$apiGet("import/modules")
      .then((response) => {
        if (response.data) {
          this.importTypes = response.data
        }
        this.loading = false
      })
      .catch(() => {
        this.result = {
          success: false,
          text: "Internal error. Please retry.",
        }
      })
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      this.loading = true
      this.result = null

      // API call
      this.$apiPost("collections/" + this.collectionId + "/import", this.data)
        .then((response) => {
          if (response.data.imported) {
            this.result = {
              success: response.data.success
            }
            if (this.result.success) {
              this.result.text = "Imported " + response.data.imported.items + " items"
            } else {
              this.result.text = "Failed to import collection"
            }
          }
          this.loading = false
        })
        .catch(() => {
          this.result = {
            success: false,
            text: "Internal error. Please retry.",
          }
        })
    }
  },
}
</script>
