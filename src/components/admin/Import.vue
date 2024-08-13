<template>
  <div class="container">
    <h1>{{ $t("Import collection") }}</h1>
    <form @submit="validate">
      <div class="mb-3">
        <label class="form-label">Import module</label>
        <select
          v-model="data.module"
          class="form-select"
          aria-label="Type of import"
          required
        >
          <template v-for="(importModule, name) in importModules" :key="name">
            <option v-if="importModule.importCollection" :value="name">
              {{ importModule.name }}
              <template v-if="importModule.description">
                : {{ importModule.description }}
              </template>
            </option>
          </template>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Source</label>
        <MediaSelector
          v-model="data.source"
          :type="data.module"
          mandatory="true"
        />
      </div>

      <div class="mb-3">
        <button
          type="submit"
          class="btn btn-primary me-2"
          :disabled="$demoMode() || !data.source || loading"
        >
          {{ $t("Import collection") }}
        </button>
        <a href="." class="btn btn-outline-secondary" :disabled="loading">
          {{ $t("Cancel") }}
        </a>
      </div>

      <div
        v-if="result"
        :class="'alert alert-' + (result.success ? 'success' : 'danger')"
        role="alert"
      >
        {{ result.text }}<br />
        <router-link :to="'/collection/' + this.collectionId + '/'">
          {{ $t("View collection") }}
        </router-link>
      </div>
      <Loading v-if="loading" info="Please wait, this may take some time..." />
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
      importModules: {},
      data: {
        module: "csv",
        source: null,
      },
      result: null,
    }
  },
  created() {
    // get import modules
    this.$apiGet("import/modules")
      .then((response) => {
        if (response.data) {
          this.importModules = response.data
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
              success: true,
              text: "Imported " + response.data.imported.items.length + " items"
            }
          }
          this.loading = false
        })
        .catch(() => {
          this.result = {
            success: false,
            text: "Internal error. Please retry.",
          }
          this.loading = false
        })
    },
  },
}
</script>
